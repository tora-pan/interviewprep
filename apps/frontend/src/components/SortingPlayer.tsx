import { useMemo } from "react";
import { bubbleSort } from "../algorithms/bubbleSort";
import { selectionSort } from "../algorithms/selectionSort";
import { insertionSort } from "../algorithms/insertionSort";
import { mergeSort } from "../algorithms/mergeSort";
import { quickSort } from "../algorithms/quickSort";
import { type Step } from "../types/step";
import { usePlayback } from "../engine/usePlayback";
import { sortRenderStateFromSteps } from "../renderer/sortRenderState";
import { KonvaSortingRenderer } from "../renderer/KonvaSortingRenderer";
import { Controls } from "./Controls";

export type SortAlgorithm =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick";

type Props = {
  algorithm: SortAlgorithm;
  array: number[];
};

function describeStep(
  step: Step | undefined,
  steps: Step[],
  index: number,
): string {
  if (!step) return "Preparing animation...";

  const { array } = sortRenderStateFromSteps(steps, index);

  switch (step.type) {
    case "sort_init":
      return `Initializing array with ${step.array.length} elements.`;
    case "sort_compare":
      return `Comparing ${array[step.i]} at index ${step.i} with ${array[step.j]} at index ${step.j}.`;
    case "sort_swap":
      return `Swapping values ${array[step.i]} and ${array[step.j]} at positions ${step.i} and ${step.j}.`;
    case "sort_overwrite":
      return `Writing value ${step.value} to position ${step.index}.`;
    case "sort_set_pivot":
      return `Pivot selected: value ${array[step.index]} at position ${step.index}.`;
    case "sort_mark_sorted":
      return `${step.indices.length} element${step.indices.length > 1 ? "s are" : " is"} now in final sorted position.`;
    case "sort_done":
      return `Sort complete. ${steps.length} steps taken.`;
    default:
      return "Running...";
  }
}

export function SortingPlayer({ algorithm, array }: Props) {
  const steps = useMemo(() => {
    switch (algorithm) {
      case "bubble":
        return bubbleSort(array);
      case "selection":
        return selectionSort(array);
      case "insertion":
        return insertionSort(array);
      case "merge":
        return mergeSort(array);
      case "quick":
        return quickSort(array);
    }
  }, [algorithm, array]);

  const playback = usePlayback(steps);
  const currentStep = steps[playback.index];
  const narration = describeStep(currentStep, steps, playback.index);

  return (
    <div className="flex flex-col gap-4">
      <Controls
        playing={playback.playing}
        setPlaying={playback.setPlaying}
        index={playback.index}
        setIndex={playback.setIndex}
        stepsLength={steps.length}
        speed={playback.speed}
        setSpeed={playback.setSpeed}
      />

      <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Step narration
        </p>
        <p className="mt-2 text-slate-100">{narration}</p>
      </div>

      <KonvaSortingRenderer steps={steps} index={playback.index} />
    </div>
  );
}
