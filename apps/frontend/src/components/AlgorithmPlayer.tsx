import { useMemo } from "react";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import { type Graph } from "../types/graph";
import { type Step } from "../types/step";
import { usePlayback } from "../engine/usePlayback";
import { KonvaGraphRenderer } from "../renderer/KonvaGraphRenderer";
import { Controls } from "./Controls";

type Props = {
  graph: Graph;
  algorithm: "bfs" | "dfs";
  startNode: string;
};

function describeStep(step: Step | undefined, algorithm: "bfs" | "dfs") {
  if (!step) return "Preparing animation...";

  switch (step.type) {
    case "init": {
      const start =
        (step.payload as { start?: string } | undefined)?.start ?? "?";
      return `Starting ${algorithm.toUpperCase()} at node ${start}.`;
    }
    case "queue_pop":
      return algorithm === "bfs"
        ? `Taking node ${step.node} from the queue to process it.`
        : `Taking node ${step.node} from the stack to process it.`;
    case "visit_node":
      return `Visiting node ${step.node}.`;
    case "discover_edge":
      return `Checking edge ${step.from} -> ${step.to}, moving from ${step.from} toward ${step.to}.`;
    case "queue_push":
      return algorithm === "bfs"
        ? `Adding node ${step.node} to the queue for a future visit.`
        : `Pushing node ${step.node} onto the stack for a future visit.`;
    case "set_active_path":
      return `Active path is now ${step.nodes.join(" -> ")}.`;
    case "done":
      return `${algorithm.toUpperCase()} traversal complete.`;
    default:
      return "Running algorithm step...";
  }
}

export function AlgorithmPlayer({ graph, algorithm, startNode }: Props) {
  const steps = useMemo(() => {
    if (algorithm === "dfs") return dfs(graph, startNode);
    return bfs(graph, startNode);
  }, [graph, algorithm, startNode]);

  const playback = usePlayback(steps);
  const currentStep = steps[playback.index];
  const narration = describeStep(currentStep, algorithm);

  return (
    <div>
      <Controls
        playing={playback.playing}
        setPlaying={playback.setPlaying}
        index={playback.index}
        setIndex={playback.setIndex}
        stepsLength={steps.length}
        speed={playback.speed}
        setSpeed={playback.setSpeed}
      />

      <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Step narration
        </p>
        <p className="mt-2 text-slate-100">{narration}</p>
        <p className="mt-2 text-xs text-slate-400">
          Step {playback.index + 1} of {steps.length}
        </p>
      </div>

      <KonvaGraphRenderer graph={graph} steps={steps} index={playback.index} />
    </div>
  );
}
