import { type Step } from "../types/step";

export type SortRenderState = {
  array: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  pivot: number | null;
  sorted: Set<number>;
};

export function sortRenderStateFromSteps(
  steps: Step[],
  index: number
): SortRenderState {
  let array: number[] = [];
  let comparing: [number, number] | null = null;
  let swapping: [number, number] | null = null;
  let pivot: number | null = null;
  const sorted = new Set<number>();

  for (let i = 0; i <= index; i++) {
    const step = steps[i];

    switch (step.type) {
      case "sort_init":
        array = [...step.array];
        break;

      case "sort_compare":
        comparing = [step.i, step.j];
        swapping = null;
        break;

      case "sort_swap": {
        const tmp = array[step.i];
        array[step.i] = array[step.j];
        array[step.j] = tmp;
        swapping = [step.i, step.j];
        comparing = null;
        break;
      }

      case "sort_overwrite":
        array[step.index] = step.value;
        break;

      case "sort_set_pivot":
        pivot = step.index;
        break;

      case "sort_mark_sorted":
        for (const idx of step.indices) {
          sorted.add(idx);
        }
        break;

      case "sort_done":
        comparing = null;
        swapping = null;
        pivot = null;
        break;
    }
  }

  return { array, comparing, swapping, pivot, sorted };
}
