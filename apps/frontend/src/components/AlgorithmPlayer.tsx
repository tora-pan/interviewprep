import { useMemo } from "react";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import { type Graph } from "../types/graph";
import { usePlayback } from "../engine/usePlayback";
import { KonvaGraphRenderer } from "../renderer/KonvaGraphRenderer";
import { Controls } from "./Controls";

type Props = {
  graph: Graph;
  algorithm: "bfs" | "dfs";
  startNode: string;
};

export function AlgorithmPlayer({ graph, algorithm, startNode }: Props) {
  const steps = useMemo(() => {
    if (algorithm === "dfs") return dfs(graph, startNode);
    return bfs(graph, startNode);
  }, [graph, algorithm, startNode]);

  const playback = usePlayback(steps);

  return (
    <div>
      <Controls
        playing={playback.playing}
        setPlaying={playback.setPlaying}
        index={playback.index}
        setIndex={playback.setIndex}
        stepsLength={steps.length}
      />

      <KonvaGraphRenderer graph={graph} steps={steps} index={playback.index} />
    </div>
  );
}
