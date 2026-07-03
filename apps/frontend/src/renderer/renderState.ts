import { type Step } from "../types/step";

export function renderStateFromSteps(steps: Step[], index: number) {
  const visited = new Set<string>();
  let activeEdge: { from: string; to: string } | null = null;
  let queue: string[] = [];

  for (let i = 0; i <= index; i++) {
    const step = steps[i];

    switch (step.type) {
      case "visit_node":
        visited.add(step.node);
        break;

      case "discover_edge":
        activeEdge = { from: step.from, to: step.to };
        break;

      case "queue_push":
        queue.push(step.node);
        break;

      case "queue_pop":
        queue = queue.filter((n) => n !== step.node);
        break;
    }
  }

  return {
    visited,
    activeEdge,
    queue,
  };
}