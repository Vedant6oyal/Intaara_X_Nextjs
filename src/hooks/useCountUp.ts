"use client";

import { useEffect, useRef, useState } from "react";

/** Ease-out cubic; gives a satisfying decelerating count. */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** requestAnimationFrame-based count-up. Restarts when `trigger` changes. */
export function useCountUp(target: number, trigger: unknown, duration = 800) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(from + (target - from) * easeOutCubic(p)));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, trigger, duration]);

  return value;
}
