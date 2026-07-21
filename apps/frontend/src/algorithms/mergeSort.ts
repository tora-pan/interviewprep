import { type Step } from "../types/step";

export function mergeSort(array: number[]): Step[] {
  const arr = [...array];
  const steps: Step[] = [];
  const n = arr.length;

  steps.push({ type: "sort_init", array: [...arr] });

  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      if (mid >= hi) continue;
      mergePart(arr, lo, mid, hi, steps);
    }
  }

  steps.push({ type: "sort_done" });
  return steps;
}

function mergePart(
  arr: number[],
  lo: number,
  mid: number,
  hi: number,
  steps: Step[]
) {
  const temp = arr.slice(lo, hi);
  const leftLen = mid - lo;
  let left = 0;
  let right = leftLen;
  let k = lo;

  while (left < leftLen && right < hi - lo) {
    steps.push({ type: "sort_compare", i: lo + left, j: lo + right });
    if (temp[left] <= temp[right]) {
      steps.push({ type: "sort_overwrite", index: k, value: temp[left] });
      arr[k] = temp[left];
      left++;
    } else {
      steps.push({ type: "sort_overwrite", index: k, value: temp[right] });
      arr[k] = temp[right];
      right++;
    }
    k++;
  }

  while (left < leftLen) {
    steps.push({ type: "sort_overwrite", index: k, value: temp[left] });
    arr[k++] = temp[left++];
  }

  while (right < hi - lo) {
    steps.push({ type: "sort_overwrite", index: k, value: temp[right] });
    arr[k++] = temp[right++];
  }

  steps.push({
    type: "sort_mark_sorted",
    indices: Array.from({ length: hi - lo }, (_, i) => lo + i),
  });
}
