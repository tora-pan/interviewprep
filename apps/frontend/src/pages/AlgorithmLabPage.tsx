import { useState } from "react";
import { AlgorithmPlayer } from "../components/AlgorithmPlayer";
import { type Graph } from "../types/graph";

const useCases: Record<"bfs" | "dfs", string[]> = {
  bfs: [
    "Find the shortest path in an unweighted graph.",
    "Explore nodes level-by-level (minimum number of edges).",
    "Solve nearest-target problems (nearest exit, nearest resource).",
    "Use in multi-source expansion or wavefront-style traversals.",
  ],
  dfs: [
    "Explore all possibilities deeply before backtracking.",
    "Use for topological patterns and cycle detection.",
    "Great for connected components and island-style problems.",
    "Use in recursion/backtracking tasks (paths, subsets, trees).",
  ],
};

type PracticeLink = {
  title: string;
  href: string;
};

const leetcodePractice: Record<"bfs" | "dfs", PracticeLink[]> = {
  bfs: [
    {
      title: "102. Binary Tree Level Order Traversal",
      href: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    },
    {
      title: "994. Rotting Oranges",
      href: "https://leetcode.com/problems/rotting-oranges/",
    },
    {
      title: "127. Word Ladder",
      href: "https://leetcode.com/problems/word-ladder/",
    },
    {
      title: "542. 01 Matrix",
      href: "https://leetcode.com/problems/01-matrix/",
    },
  ],
  dfs: [
    {
      title: "200. Number of Islands",
      href: "https://leetcode.com/problems/number-of-islands/",
    },
    {
      title: "695. Max Area of Island",
      href: "https://leetcode.com/problems/max-area-of-island/",
    },
    {
      title: "797. All Paths From Source to Target",
      href: "https://leetcode.com/problems/all-paths-from-source-to-target/",
    },
    {
      title: "207. Course Schedule",
      href: "https://leetcode.com/problems/course-schedule/",
    },
  ],
};

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
            <h3 className="font-semibold text-cyan-400">
              When to use {algorithm.toUpperCase()}
            </h3>

            <ul className="mt-3 text-sm text-slate-300 space-y-2">
              {useCases[algorithm].map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="font-semibold text-cyan-400">
              LeetCode practice ({algorithm.toUpperCase()})
            </h3>

            <ul className="mt-3 text-sm text-slate-300 space-y-2">
              {leetcodePractice[algorithm].map((problem) => (
                <li key={problem.href}>
                  <a
                    href={problem.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-200 hover:text-cyan-300 underline underline-offset-2"
                  >
                    {problem.title}
                  </a>
                </li>
              ))}
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
