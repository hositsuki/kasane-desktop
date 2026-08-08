import { describe, it, expect } from 'vitest';
import {
  createGestureState,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  evaluateGesture,
  gestureDidTrigger,
  GESTURE_PRESS_INTERVAL_MS,
  GESTURE_MAX_DURATION_MS,
  GESTURE_MIN_VERTICAL_PX,
  GESTURE_HORIZONTAL_RATIO,
} from './gesture';

function ev(
  buttons: number,
  x: number,
  y: number,
  timeStamp = 0
): {
  buttons: number;
  clientX: number;
  clientY: number;
  timeStamp: number;
} {
  return { buttons, clientX: x, clientY: y, timeStamp };
}

describe('dual-button downward gesture state machine', () => {
  it('starts idle', () => {
    expect(createGestureState().phase).toBe('idle');
  });

  it('waits for second button', () => {
    let s = createGestureState();
    s = handlePointerDown(s, ev(1, 100, 100, 0));
    expect(s.phase).toBe('waiting_second');
  });

  it('cancels if second button is too late', () => {
    let s = createGestureState();
    s = handlePointerDown(s, ev(1, 100, 100, 0));
    s = handlePointerDown(s, ev(3, 110, 100, GESTURE_PRESS_INTERVAL_MS + 10));
    expect(s.phase).toBe('cancelled');
  });

  it('tracks after both buttons down within interval', () => {
    let s = createGestureState();
    s = handlePointerDown(s, ev(1, 100, 100, 0));
    s = handlePointerDown(s, ev(3, 110, 100, 50));
    expect(s.phase).toBe('tracking');
  });

  it('triggers on sufficient downward movement', () => {
    let s = createGestureState();
    s = handlePointerDown(s, ev(1, 100, 100, 0));
    s = handlePointerDown(s, ev(3, 110, 100, 50));
    s = handlePointerMove(s, ev(3, 105, 100 + GESTURE_MIN_VERTICAL_PX + 5, 100));
    s = evaluateGesture(s, 100);
    expect(s.phase).toBe('triggered');
    expect(gestureDidTrigger(s)).toBe(true);
  });

  it('does not trigger if movement is mostly horizontal', () => {
    let s = createGestureState();
    s = handlePointerDown(s, ev(1, 100, 100, 0));
    s = handlePointerDown(s, ev(3, 110, 100, 50));
    const vertical = GESTURE_MIN_VERTICAL_PX + 5;
    const horizontal = vertical / GESTURE_HORIZONTAL_RATIO + 10; // too much horizontal
    s = handlePointerMove(s, ev(3, 100 + horizontal, 100 + vertical, 100));
    s = evaluateGesture(s, 100);
    expect(s.phase).not.toBe('triggered');
  });

  it('cancels if released before threshold', () => {
    let s = createGestureState();
    s = handlePointerDown(s, ev(1, 100, 100, 0));
    s = handlePointerDown(s, ev(3, 110, 100, 50));
    s = handlePointerMove(s, ev(3, 105, 120, 100));
    s = handlePointerUp(s, ev(0, 105, 120, 150));
    expect(s.phase).toBe('cancelled');
  });

  it('cancels when duration exceeds maximum', () => {
    let s = createGestureState();
    s = handlePointerDown(s, ev(1, 100, 100, 0));
    s = handlePointerDown(s, ev(3, 110, 100, 50));
    s = handlePointerMove(s, ev(3, 105, 200, GESTURE_MAX_DURATION_MS + 1));
    s = evaluateGesture(s, GESTURE_MAX_DURATION_MS + 1);
    expect(s.phase).toBe('cancelled');
  });

  it('resets after triggered', () => {
    let s = createGestureState();
    s = handlePointerDown(s, ev(1, 100, 100, 0));
    s = handlePointerDown(s, ev(3, 110, 100, 50));
    s = handlePointerMove(s, ev(3, 105, 200, 100));
    s = evaluateGesture(s, 100);
    expect(s.phase).toBe('triggered');
    s = handlePointerUp(s, ev(0, 105, 200, 150));
    expect(s.phase).toBe('idle');
  });
});
