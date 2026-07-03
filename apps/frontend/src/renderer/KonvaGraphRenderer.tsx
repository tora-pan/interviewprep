import React from "react";
import { Stage, Layer, Circle, Line, Text } from "react-konva";
import { type Graph } from "../types/graph";
import { type Step } from "../types/step";
import { renderStateFromSteps } from "./renderState";

type Props = {
  graph: Graph;
  steps: Step[];
  index: number;
};

export function KonvaGraphRenderer({ graph, steps, index }: Props) {
  const state = renderStateFromSteps(steps, index);

  return (
    <Stage width={700} height={500}>
      <Layer>
        {/* EDGES */}
        {graph.edges.map((e, i) => {
          const from = graph.nodes.find((n) => n.id === e.from)!;
          const to = graph.nodes.find((n) => n.id === e.to)!;

          const active =
            state.activeEdge?.from === e.from && state.activeEdge?.to === e.to;

          return (
            <Line
              key={i}
              points={[from.x, from.y, to.x, to.y]}
              stroke={active ? "orange" : "#999"}
              strokeWidth={active ? 4 : 2}
            />
          );
        })}

        {/* NODES */}
        {graph.nodes.map((n) => {
          const visited = state.visited.has(n.id);

          return (
            <React.Fragment key={n.id}>
              <Circle
                x={n.x}
                y={n.y}
                radius={18}
                fill={visited ? "#4ade80" : "#e5e7eb"}
                stroke="#333"
              />

              <Text x={n.x - 5} y={n.y - 5} text={n.id} />
            </React.Fragment>
          );
        })}
      </Layer>
    </Stage>
  );
}
