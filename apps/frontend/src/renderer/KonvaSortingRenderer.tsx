import { useEffect, useMemo, useRef } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
import Konva from "konva";
import { type Step } from "../types/step";
import { sortRenderStateFromSteps } from "./sortRenderState";

type Props = {
  steps: Step[];
  index: number;
};

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 400;
const PADDING_X = 30;
const PADDING_Y = 40;
const USABLE_WIDTH = CANVAS_WIDTH - PADDING_X * 2;
const USABLE_HEIGHT = CANVAS_HEIGHT - PADDING_Y * 2 - 30;

const COLOR_SORTED = "#4ade80";
const COLOR_SWAPPING = "#f97316";
const COLOR_COMPARING = "#fbbf24";
const COLOR_PIVOT = "#a855f7";
const COLOR_DEFAULT = "#334155";

function getBarColor(
  i: number,
  sorted: Set<number>,
  swapping: [number, number] | null,
  comparing: [number, number] | null,
  pivot: number | null,
): string {
  if (sorted.has(i)) return COLOR_SORTED;
  if (swapping !== null && (swapping[0] === i || swapping[1] === i))
    return COLOR_SWAPPING;
  if (comparing !== null && (comparing[0] === i || comparing[1] === i))
    return COLOR_COMPARING;
  if (pivot === i) return COLOR_PIVOT;
  return COLOR_DEFAULT;
}

export function KonvaSortingRenderer({ steps, index }: Props) {
  const barRefs = useRef<Map<number, Konva.Rect>>(new Map());

  const state = useMemo(
    () => sortRenderStateFromSteps(steps, index),
    [steps, index],
  );

  const n = state.array.length;
  const barWidth = n > 0 ? (USABLE_WIDTH - (n - 1) * 2) / n : 0;
  const maxVal = n > 0 ? Math.max(...state.array) : 1;

  const barX = (i: number) => PADDING_X + i * (barWidth + 2);
  const barHeight = (val: number) => (val / maxVal) * USABLE_HEIGHT;
  const barY = (val: number) => PADDING_Y + USABLE_HEIGHT - barHeight(val);

  useEffect(() => {
    if (state.array.length === 0) return;
    state.array.forEach((_, i) => {
      const rectRef = barRefs.current.get(i);
      if (!rectRef) return;
      const targetFill = getBarColor(
        i,
        state.sorted,
        state.swapping,
        state.comparing,
        state.pivot,
      );
      new Konva.Tween({
        node: rectRef,
        fill: targetFill,
        duration: 0.2,
      }).play();
    });
  }, [state]);

  return (
    <div className="w-full overflow-x-auto">
      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            fill="#0f172a"
          />
          {n > 0 &&
            state.array.map((val, i) => (
              <Rect
                key={i}
                x={barX(i)}
                y={barY(val)}
                width={barWidth}
                height={barHeight(val)}
                fill={getBarColor(
                  i,
                  state.sorted,
                  state.swapping,
                  state.comparing,
                  state.pivot,
                )}
                ref={(node) => {
                  if (node) barRefs.current.set(i, node);
                }}
              />
            ))}
          {n > 0 &&
            barWidth >= 14 &&
            state.array.map((val, i) => (
              <Text
                key={`val-${i}`}
                x={barX(i) + barWidth / 2}
                y={barY(val) - 14}
                text={String(val)}
                fontSize={10}
                fill="#94a3b8"
                offsetX={String(val).length * 3}
              />
            ))}
          {n > 0 &&
            state.array.map((_, i) => (
              <Text
                key={`idx-${i}`}
                x={barX(i) + barWidth / 2}
                y={CANVAS_HEIGHT - PADDING_Y + 6}
                text={String(i)}
                fontSize={9}
                fill="#475569"
                offsetX={String(i).length * 2.5}
              />
            ))}
        </Layer>
      </Stage>
    </div>
  );
}
