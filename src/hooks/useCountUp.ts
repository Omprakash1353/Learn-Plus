import { useEffect, useState } from "react";

export function useCountUp(
  targetValue: number,
  duration: number = 5000,
): string {
  const [count, setCount] = useState<string>("0");

  useEffect(() => {
    let animationFrameId: number | null = null;

    const startTime = performance.now();

    const updateCount = (): void => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const firstPhaseDuration = duration * 0.4;
      const secondPhaseDuration = duration * 0.2;

      let t;
      if (elapsed < firstPhaseDuration) {
        t = Math.min(elapsed / firstPhaseDuration, 1);
        t = t * 0.98;
      } else if (elapsed < firstPhaseDuration + secondPhaseDuration) {
        t =
          0.98 + ((elapsed - firstPhaseDuration) / secondPhaseDuration) * 0.01;
      } else {
        t =
          0.99 +
          ((elapsed - firstPhaseDuration - secondPhaseDuration) /
            (duration - firstPhaseDuration - secondPhaseDuration)) *
            0.01;
      }

      const easedValue = easeInOut(t);

      const currentCount = targetValue * easedValue;
      setCount(currentCount.toFixed(2));

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(targetValue.toFixed(2));
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetValue, duration]);

  return count;
}

const easeInOut = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};
