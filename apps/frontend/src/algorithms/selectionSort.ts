import { type Step } from "../types/step";

export function selectionSort(array: number[]): Step[] {
  const arr = [...array];
  const steps: Step[] = [];
  const n = arr.length;

  steps.push({ type: "sort_init", array: [...arr] });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ type: "sort_compare", i: minIdx, j });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      steps.push({ type: "sort_swap", i, j: minIdx });
      const tmp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = tmp;
    }
    steps.push({ type: "sort_mark_sorted", indices: [i] });
  }

  steps.push({ type: "sort_mark_sorted", indices: [n - 1] });
  steps.push({ type: "sort_done" });
  return steps;
}
