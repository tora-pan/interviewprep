import React, { useMemo, useState, useEffect } from "react";
import { Stage, Layer, Circle, Line, Text } from "react-konva";

type Graph = {
  nodes: { id: string; x: number; y: number }[];
  edges: { from: string; to: string }[];
};

type Step =
  | { type: "start"; node: string }
  | { type: "visit"; node: string }
  | { type: "enqueue"; from: string; to: string }
  | { type: "edge"; from: string; to: string }
  | { type: "done" };

/**
 * BFS with richer steps (better for narration)
 */
function bfsSteps(graph: Graph, start: string): Step[] {
  const steps: Step[] = [];

  const adj: Record<string, string[]> = {};
  graph.nodes.forEach((n) => (adj[n.id] = []));
  graph.edges.forEach((e) => adj[e.from].push(e.to));

  const queue: string[] = [start];
  const visited = new Set<string>();

  steps.push({ type: "start", node: start });

  while (queue.length) {
    const node = queue.shift()!;
    if (visited.has(node)) continue;

    visited.add(node);
    steps.push({ type: "visit", node });

    for (const neighbor of adj[node]) {
      steps.push({ type: "edge", from: node, to: neighbor });
      if (!visited.has(neighbor)) {
        steps.push({ type: "enqueue", from: node, to: neighbor });
        queue.push(neighbor);
      }
    }
  }

  steps.push({ type: "done" });

  return steps;
}

/**
 * Balanced tree graph
 */
const sampleGraph: Graph = {
  nodes: [
    { id: "A", x: 300, y: 50 },

    { id: "B", x: 150, y: 130 },
    { id: "C", x: 450, y: 130 },

    { id: "D", x: 75, y: 220 },
    { id: "E", x: 225, y: 220 },
    { id: "F", x: 375, y: 220 },
    { id: "G", x: 525, y: 220 },

    { id: "H", x: 37, y: 320 },
    { id: "I", x: 112, y: 320 },
    { id: "J", x: 187, y: 320 },
    { id: "K", x: 262, y: 320 },
    { id: "L", x: 337, y: 320 },
    { id: "M", x: 412, y: 320 },
    { id: "N", x: 487, y: 320 },
    { id: "O", x: 562, y: 320 },
  ],
  edges: [
    { from: "A", to: "B" },
    { from: "A", to: "C" },

    { from: "B", to: "D" },
    { from: "B", to: "E" },
    { from: "C", to: "F" },
    { from: "C", to: "G" },

    { from: "D", to: "H" },
    { from: "D", to: "I" },
    { from: "E", to: "J" },
    { from: "E", to: "K" },
    { from: "F", to: "L" },
    { from: "F", to: "M" },
    { from: "G", to: "N" },
    { from: "G", to: "O" },
  ],
};

export default function BFSVisualizer() {
  const steps = useMemo(() => bfsSteps(sampleGraph, "A"), []);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;

    const id = setInterval(() => {
      setIndex((i) => Math.min(i + 1, steps.length - 1));
    }, 700);

    return () => clearInterval(id);
  }, [playing, steps.length]);

  /**
   * visited nodes
   */
  const visited = useMemo(() => {
    const set = new Set<string>();

    for (let i = 0; i <= index; i++) {
      const step = steps[i];
      if (step.type === "visit") set.add(step.node);
    }

    return set;
  }, [index, steps]);

  /**
   * active edge highlight
   */
  const activeEdge = steps[index];

  /**
   * 👇 STEP NARRATION (this is the new part)
   */
  const narration = useMemo(() => {
    const step = steps[index];

    switch (step.type) {
      case "start":
        return `Starting BFS at node ${step.node}. We initialize the queue.`;

      case "visit":
        return `Visiting node ${step.node}. Marking it as visited.`;

      case "edge":
        return `Inspecting edge ${step.from} → ${step.to}. Checking if ${step.to} should be explored.`;

      case "enqueue":
        return `Adding ${step.to} to the queue from ${step.from}.`;

      case "done":
        return `BFS complete. All reachable nodes have been explored.`;

      default:
        return "";
    }
  }, [index, steps]);

  return (
    <div>
      {/* Controls */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setPlaying((p) => !p)}>
          {playing ? "Pause" : "Play"}
        </button>

        <button onClick={() => setIndex((i) => Math.max(i - 1, 0))}>
          Step Back
        </button>

        <button
          onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
        >
          Step Forward
        </button>
      </div>

      {/* 🔥 NARRATION PANEL */}
      <div
        style={{
          marginBottom: 10,
          padding: 12,
          background: "#111",
          color: "#fff",
          borderRadius: 8,
          fontFamily: "monospace",
        }}
      >
        {narration}
      </div>

      {/* CANVAS */}
      <Stage width={600} height={400}>
        <Layer>
          {/* edges */}
          {sampleGraph.edges.map((e, idx) => {
            const from = sampleGraph.nodes.find((n) => n.id === e.from)!;
            const to = sampleGraph.nodes.find((n) => n.id === e.to)!;

            const isActive =
              activeEdge.type === "edge" &&
              activeEdge.from === e.from &&
              activeEdge.to === e.to;

            return (
              <Line
                key={idx}
                points={[from.x, from.y, to.x, to.y]}
                stroke={isActive ? "orange" : "#999"}
                strokeWidth={isActive ? 4 : 2}
              />
            );
          })}

          {/* nodes */}
          {sampleGraph.nodes.map((n) => {
            const isVisited = visited.has(n.id);

            return (
              <React.Fragment key={n.id}>
                <Circle
                  x={n.x}
                  y={n.y}
                  radius={20}
                  fill={isVisited ? "#4ade80" : "#e5e7eb"}
                  stroke="#333"
                  strokeWidth={2}
                />

                <Text x={n.x - 5} y={n.y - 7} text={n.id} fontSize={14} />
              </React.Fragment>
            );
          })}
        </Layer>
      </Stage>

      {/* Step indicator */}
      <div style={{ marginTop: 10 }}>
        Step {index} / {steps.length - 1}
      </div>
    </div>
  );
}

