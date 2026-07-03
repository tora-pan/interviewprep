import { type Graph } from "../types/graph";
import { type Step } from "../types/step";

function buildAdj(graph: Graph) {
  const adj: Record<string, string[]> = {};

  graph.nodes.forEach((n) => (adj[n.id] = []));
  graph.edges.forEach((e) => adj[e.from].push(e.to));

  return adj;
}

export function dfs(graph: Graph, start: string): Step[] {
  const steps: Step[] = [];
  const adj = buildAdj(graph);

  const stack: string[] = [start];
  const visited = new Set<string>();

  steps.push({ type: "init", payload: { start } });

  while (stack.length) {
    const node = stack.pop()!;

    steps.push({ type: "queue_pop", node });

    if (visited.has(node)) continue;
    visited.add(node);

    steps.push({ type: "visit_node", node });

    for (const neighbor of adj[node]) {
      steps.push({
        type: "discover_edge",
        from: node,
        to: neighbor,
      });

      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        steps.push({ type: "queue_push", node: neighbor });
      }
    }
  }

  steps.push({ type: "done" });

  return steps;
}