import { useState } from "react";
import { AlgorithmPlayer } from "../components/AlgorithmPlayer";
import { type Graph } from "../types/graph";

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

export default function AlgorithmLabPage() {
  const [algorithm, setAlgorithm] = useState<"bfs" | "dfs">("bfs");
  const [startNode] = useState("A");

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* HEADER */}
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Algorithm <span className="text-cyan-400">Lab</span>
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setAlgorithm("bfs")}
            className={`px-4 py-2 rounded-lg border ${
              algorithm === "bfs"
                ? "bg-cyan-500 text-black border-cyan-400"
                : "border-slate-700 text-slate-300"
            }`}
          >
            BFS
          </button>

          <button
            onClick={() => setAlgorithm("dfs")}
            className={`px-4 py-2 rounded-lg border ${
              algorithm === "dfs"
                ? "bg-cyan-500 text-black border-cyan-400"
                : "border-slate-700 text-slate-300"
            }`}
          >
            DFS
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* LEFT: CONTROLS PANEL */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h2 className="font-semibold text-cyan-400">Algorithm Controls</h2>

            <p className="text-sm text-slate-400 mt-2">
              Select an algorithm and visualize how it explores a graph step by
              step.
            </p>

            <div className="mt-4 text-sm text-slate-300 space-y-2">
              <div>
                <span className="text-slate-500">Current:</span>{" "}
                {algorithm.toUpperCase()}
              </div>

              <div>
                <span className="text-slate-500">Start Node:</span> {startNode}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="font-semibold text-cyan-400">How it works</h3>

            <ul className="mt-3 text-sm text-slate-300 space-y-2">
              <li>• Each algorithm produces a timeline of steps</li>
              <li>• Steps are replayed frame-by-frame</li>
              <li>• Renderer stays completely generic</li>
              <li>• Same engine works for all algorithms</li>
            </ul>
          </div>
        </div>

        {/* RIGHT: VISUALIZER */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <AlgorithmPlayer
              graph={sampleGraph}
              algorithm={algorithm}
              startNode={startNode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
