import { useEffect, useRef } from 'react';

/** `ref.current` is true while the component is mounted; check it before setting state after an await. */
export function useMountedRef() {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return mounted;
}
