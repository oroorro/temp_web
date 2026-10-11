import { useLayoutEffect, useRef } from 'react';

/** A ref that always holds the value from the latest render, for use inside stable callbacks. */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
