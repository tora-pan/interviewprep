import { type Step } from "../types/step";

export function bubbleSort(array: number[]): Step[] {
  const arr = [...array];
  const steps: Step[] = [];
  const n = arr.length;

  steps.push({ type: "sort_init", array: [...arr] });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push({ type: "sort_compare", i: j, j: j + 1 });
      if (arr[j] > arr[j + 1]) {
        steps.push({ type: "sort_swap", i: j, j: j + 1 });
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
    steps.push({ type: "sort_mark_sorted", indices: [n - 1 - i] });
  }

  steps.push({ type: "sort_mark_sorted", indices: [0] });
  steps.push({ type: "sort_done" });
  return steps;
}
