import { type Step } from "../types/step";

export function renderStateFromSteps(steps: Step[], index: number) {
  const visited = new Set<string>();
  const inQueue = new Set<string>();
  let processing: string | null = null;
  let activeEdge: { from: string; to: string } | null = null;
  let queue: string[] = [];

  for (let i = 0; i <= index; i++) {
    const step = steps[i];

    switch (step.type) {
      case "visit_node":
        visited.add(step.node);
        processing = null;
        break;

      case "discover_edge":
        activeEdge = { from: step.from, to: step.to };
        break;

      case "queue_push":
        inQueue.add(step.node);
        queue.push(step.node);
        break;

      case "queue_pop":
        inQueue.delete(step.node);
        queue = queue.filter((n) => n !== step.node);
        processing = step.node;
        break;
    }
  }

  return {
    visited,
    inQueue,
    processing,
    activeEdge,
    queue,
  };
}
