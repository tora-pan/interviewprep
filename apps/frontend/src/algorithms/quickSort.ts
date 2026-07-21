import { type Step } from "../types/step";

export function quickSort(array: number[]): Step[] {
  const arr = [...array];
  const steps: Step[] = [];

  steps.push({ type: "sort_init", array: [...arr] });
  qsHelper(arr, 0, arr.length - 1, steps);
  steps.push({ type: "sort_done" });
  return steps;
}

function qsHelper(
  arr: number[],
  lo: number,
  hi: number,
  steps: Step[]
) {
  if (lo > hi) return;
  if (lo === hi) {
    steps.push({ type: "sort_mark_sorted", indices: [lo] });
    return;
  }
  const p = partition(arr, lo, hi, steps);
  qsHelper(arr, lo, p - 1, steps);
  qsHelper(arr, p + 1, hi, steps);
}

function partition(
  arr: number[],
  lo: number,
  hi: number,
  steps: Step[]
): number {
  steps.push({ type: "sort_set_pivot", index: hi });
  const pivotVal = arr[hi];
  let i = lo - 1;

  for (let j = lo; j < hi; j++) {
    steps.push({ type: "sort_compare", i: j, j: hi });
    if (arr[j] <= pivotVal) {
      i++;
      if (i !== j) {
        steps.push({ type: "sort_swap", i, j });
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
    }
  }

  const pivotPos = i + 1;
  if (pivotPos !== hi) {
    steps.push({ type: "sort_swap", i: pivotPos, j: hi });
    const tmp = arr[pivotPos];
    arr[pivotPos] = arr[hi];
    arr[hi] = tmp;
  }

  steps.push({ type: "sort_mark_sorted", indices: [pivotPos] });
  return pivotPos;
}
