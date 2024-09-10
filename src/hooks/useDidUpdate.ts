import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

export function useDidUpdate(callback: EffectCallback, dependencies: DependencyList): void {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      callback();
    } else {
      hasMounted.current = true;
    }
  }, dependencies);
}