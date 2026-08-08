/**
 * Pure dual-button downward gesture state machine.
 *
 * Trigger thresholds:
 *  - Both buttons pressed within PRESS_INTERVAL_MS.
 *  - Both released within MAX_DURATION_MS of the first press.
 *  - Total vertical movement >= MIN_VERTICAL_PX.
 *  - Vertical movement > HORIZONTAL_RATIO * horizontal movement.
 */

export const GESTURE_PRESS_INTERVAL_MS = 220;
export const GESTURE_MAX_DURATION_MS = 650;
export const GESTURE_MIN_VERTICAL_PX = 80;
export const GESTURE_HORIZONTAL_RATIO = 1.4;

export type GesturePhase = 'idle' | 'waiting_second' | 'tracking' | 'triggered' | 'cancelled';

export interface GesturePoint {
  x: number;
  y: number;
}

export interface GestureState {
  phase: GesturePhase;
  startTime: number;
  firstButton: number; // 0 = left, 1 = right
  firstDown: GesturePoint;
  secondDown: GesturePoint;
  current: GesturePoint;
  triggeredAt?: number;
}

export interface GestureEvent {
  buttons: number; // bit mask: 1 = left, 2 = right
  clientX: number;
  clientY: number;
  timeStamp: number;
}

export function createGestureState(): GestureState {
  return {
    phase: 'idle',
    startTime: 0,
    firstButton: 0,
    firstDown: { x: 0, y: 0 },
    secondDown: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
  };
}

export function handlePointerDown(
  state: GestureState,
  ev: GestureEvent
): GestureState {
  if (state.phase === 'triggered' || state.phase === 'cancelled') {
    state = createGestureState();
  }

  const leftDown = (ev.buttons & 1) !== 0;
  const rightDown = (ev.buttons & 2) !== 0;

  if (state.phase === 'idle') {
    if (leftDown && !rightDown) {
      return {
        ...state,
        phase: 'waiting_second',
        startTime: ev.timeStamp,
        firstButton: 0,
        firstDown: { x: ev.clientX, y: ev.clientY },
        current: { x: ev.clientX, y: ev.clientY },
      };
    }
    if (rightDown && !leftDown) {
      return {
        ...state,
        phase: 'waiting_second',
        startTime: ev.timeStamp,
        firstButton: 1,
        firstDown: { x: ev.clientX, y: ev.clientY },
        current: { x: ev.clientX, y: ev.clientY },
      };
    }
    return state;
  }

  if (state.phase === 'waiting_second') {
    const elapsed = ev.timeStamp - state.startTime;
    if (elapsed > GESTURE_PRESS_INTERVAL_MS) {
      return { ...createGestureState(), phase: 'cancelled' };
    }

    const second = state.firstButton === 0 ? rightDown : leftDown;
    if (second) {
      return {
        ...state,
        phase: 'tracking',
        secondDown: { x: ev.clientX, y: ev.clientY },
        current: { x: ev.clientX, y: ev.clientY },
      };
    }
    return state;
  }

  return state;
}

export function handlePointerMove(state: GestureState, ev: GestureEvent): GestureState {
  if (state.phase !== 'tracking') return state;
  return { ...state, current: { x: ev.clientX, y: ev.clientY } };
}

export function evaluateGesture(state: GestureState, timeStamp: number): GestureState {
  if (state.phase !== 'tracking') return state;

  if (timeStamp - state.startTime > GESTURE_MAX_DURATION_MS) {
    return { ...createGestureState(), phase: 'cancelled' };
  }

  // Use the average start point so either button can lead.
  const startX = (state.firstDown.x + state.secondDown.x) / 2;
  const startY = (state.firstDown.y + state.secondDown.y) / 2;
  const dx = Math.abs(state.current.x - startX);
  const dy = state.current.y - startY;

  if (dy >= GESTURE_MIN_VERTICAL_PX && dy > GESTURE_HORIZONTAL_RATIO * dx) {
    return { ...state, phase: 'triggered', triggeredAt: timeStamp };
  }

  return state;
}

export function handlePointerUp(state: GestureState, ev: GestureEvent): GestureState {
  if (state.phase === 'idle') return state;

  const leftDown = (ev.buttons & 1) !== 0;
  const rightDown = (ev.buttons & 2) !== 0;

  if (state.phase === 'tracking') {
    const evaluated = evaluateGesture(state, ev.timeStamp);
    if (evaluated.phase === 'triggered') {
      return evaluated;
    }
    // Tracked but released before the gesture threshold was met.
    if (!leftDown && !rightDown) {
      return { ...createGestureState(), phase: 'cancelled' };
    }
    return state;
  }

  if (state.phase === 'waiting_second' && !leftDown && !rightDown) {
    return { ...createGestureState(), phase: 'cancelled' };
  }

  if (!leftDown && !rightDown) {
    return createGestureState();
  }

  return state;
}

export function gestureDidTrigger(state: GestureState): boolean {
  return state.phase === 'triggered';
}
