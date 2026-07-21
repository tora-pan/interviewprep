import { type Step } from "../types/step";

export function insertionSort(array: number[]): Step[] {
  const arr = [...array];
  const steps: Step[] = [];
  const n = arr.length;

  steps.push({ type: "sort_init", array: [...arr] });
  steps.push({ type: "sort_mark_sorted", indices: [0] });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0) {
      steps.push({ type: "sort_compare", i: j, j: j + 1 });
      if (arr[j] > key) {
        steps.push({ type: "sort_overwrite", index: j + 1, value: arr[j] });
        arr[j + 1] = arr[j];
        j--;
      } else {
        break;
      }
    }
    steps.push({ type: "sort_overwrite", index: j + 1, value: key });
    arr[j + 1] = key;
    steps.push({ type: "sort_mark_sorted", indices: [i] });
  }

  steps.push({ type: "sort_done" });
  return steps;
}
