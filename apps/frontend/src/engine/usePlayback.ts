import { useEffect, useState } from "react";
import { type Step } from "../types/step";

export function usePlayback(steps: Step[]) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!playing) return;

    const id = setInterval(() => {
      setIndex((i) => Math.min(i + 1, steps.length - 1));
    }, 600 / speed);

    return () => clearInterval(id);
  }, [playing, speed, steps.length]);

  return {
    index,
    setIndex,
    playing,
    setPlaying,
    speed,
    setSpeed,
    currentStep: steps[index],
  };
}