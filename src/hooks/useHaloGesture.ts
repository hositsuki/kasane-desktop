import { useState, useCallback, useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
  createGestureState,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  evaluateGesture,
  gestureDidTrigger,
  type GestureState,
  type GestureEvent,
} from '@/lib/gesture';

export interface HaloGestureCallbacks {
  onTrigger?: () => void;
}

function toGestureEvent(ev: ReactPointerEvent<HTMLElement>): GestureEvent {
  return {
    buttons: ev.buttons,
    clientX: ev.clientX,
    clientY: ev.clientY,
    timeStamp: ev.timeStamp,
  };
}

export function useHaloGesture({ onTrigger }: HaloGestureCallbacks = {}) {
  const [state, setState] = useState<GestureState>(() => createGestureState());
  const rafRef = useRef<number | null>(null);

  const onPointerDown = useCallback((ev: ReactPointerEvent<HTMLElement>) => {
    if (ev.button !== 0 && ev.button !== 2) return;
    setState((prev) => handlePointerDown(prev, toGestureEvent(ev)));
  }, []);

  const onPointerMove = useCallback((ev: ReactPointerEvent<HTMLElement>) => {
    setState((prev) => {
      const moved = handlePointerMove(prev, toGestureEvent(ev));
      return evaluateGesture(moved, ev.timeStamp);
    });
  }, []);

  const onPointerUp = useCallback((ev: ReactPointerEvent<HTMLElement>) => {
    setState((prev) => handlePointerUp(prev, toGestureEvent(ev)));
  }, []);

  useEffect(() => {
    if (gestureDidTrigger(state)) {
      onTrigger?.();
      // Reset after firing so the gesture fires only once.
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setState(createGestureState()));
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state, onTrigger]);

  const binders = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };

  return { state, binders };
}
