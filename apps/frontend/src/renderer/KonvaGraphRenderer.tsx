import { useEffect, useRef } from "react";
import { Stage, Layer, Circle, Arrow, Text, Rect } from "react-konva";
import Konva from "konva";
import { type Graph } from "../types/graph";
import { type Step } from "../types/step";
import { renderStateFromSteps } from "./renderState";

type Props = {
  graph: Graph;
  steps: Step[];
  index: number;
};

type RenderState = ReturnType<typeof renderStateFromSteps>;

function resolveNodeFill(nodeId: string, state: RenderState): string {
  if (state.visited.has(nodeId)) return "#4ade80";
  if (state.processing === nodeId) return "#60a5fa";
  if (state.inQueue.has(nodeId)) return "#fbbf24";
  return "#1e293b";
}

function resolveNodeStroke(nodeId: string, state: RenderState): string {
  const isColored =
    state.visited.has(nodeId) ||
    state.processing === nodeId ||
    state.inQueue.has(nodeId);
  return isColored ? "#1e293b" : "#94a3b8";
}

export function KonvaGraphRenderer({ graph, steps, index }: Props) {
  const state = renderStateFromSteps(steps, index);
  const circleRefs = useRef<Map<string, Konva.Circle>>(new Map());
  const prevProcessingRef = useRef<string | null>(null);

  useEffect(() => {
    graph.nodes.forEach((n) => {
      const circleRef = circleRefs.current.get(n.id);
      if (!circleRef) return;

      const targetFill = resolveNodeFill(n.id, state);
      new Konva.Tween({
        node: circleRef,
        fill: targetFill,
        duration: 0.25,
        easing: Konva.Easings.EaseInOut,
      }).play();

      if (state.processing === n.id && prevProcessingRef.current !== n.id) {
        new Konva.Tween({
          node: circleRef,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 0.15,
        }).play();
        setTimeout(() => {
          new Konva.Tween({
            node: circleRef,
            scaleX: 1.0,
            scaleY: 1.0,
            duration: 0.15,
          }).play();
        }, 150);
      }
    });

    prevProcessingRef.current = state.processing;
  }, [state, graph.nodes]);

  return (
    <div className="w-full overflow-x-auto">
      <Stage width={700} height={500}>
        <Layer>
          <Rect x={0} y={0} width={700} height={500} fill="#0f172a" />

          {graph.edges.map((e, i) => {
            const from = graph.nodes.find((n) => n.id === e.from)!;
            const to = graph.nodes.find((n) => n.id === e.to)!;

            const active =
              state.activeEdge?.from === e.from &&
              state.activeEdge?.to === e.to;

            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const nodeRadius = 20;
            const ratio = dist > 0 ? (dist - nodeRadius) / dist : 0;
            const endX = from.x + dx * ratio;
            const endY = from.y + dy * ratio;

            return (
              <Arrow
                key={i}
                points={[from.x, from.y, endX, endY]}
                stroke={active ? "#f97316" : "#475569"}
                strokeWidth={active ? 3 : 1.5}
                fill={active ? "#f97316" : "#475569"}
                pointerLength={8}
                pointerWidth={6}
                shadowColor={active ? "#f97316" : undefined}
                shadowBlur={active ? 12 : 0}
                shadowEnabled={active}
              />
            );
          })}

          {graph.edges.map((e, i) => {
            if (e.weight === undefined) return null;
            const from = graph.nodes.find((n) => n.id === e.from)!;
            const to = graph.nodes.find((n) => n.id === e.to)!;
            return (
              <Text
                key={`weight-${i}`}
                x={(from.x + to.x) / 2 - 8}
                y={(from.y + to.y) / 2 - 8}
                text={String(e.weight)}
                fill="#94a3b8"
                fontSize={11}
              />
            );
          })}

          {graph.nodes.map((n) => (
            <Circle
              key={n.id}
              x={n.x}
              y={n.y}
              radius={18}
              fill={resolveNodeFill(n.id, state)}
              stroke={resolveNodeStroke(n.id, state)}
              strokeWidth={1.5}
              ref={(node) => {
                if (node) {
                  circleRefs.current.set(n.id, node);
                } else {
                  circleRefs.current.delete(n.id);
                }
              }}
            />
          ))}

          {graph.nodes.map((n) => (
            <Text
              key={`label-${n.id}`}
              x={n.x}
              y={n.y}
              text={n.id}
              fontSize={13}
              fontStyle="bold"
              fill="#0f172a"
              offsetX={n.id.length > 1 ? 7 : 4}
              offsetY={5}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
