import { useState } from "react";
import { AlgorithmPlayer } from "../components/AlgorithmPlayer";
import { SortingPlayer, type SortAlgorithm } from "../components/SortingPlayer";
import { type Graph } from "../types/graph";

type PracticeLink = { title: string; href: string };

const graphUseCases: Record<"bfs" | "dfs", string[]> = {
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

const graphLeetcode: Record<"bfs" | "dfs", PracticeLink[]> = {
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

const graphComplexity: Record<"bfs" | "dfs", { time: string; space: string }> =
  {
    bfs: { time: "O(V + E)", space: "O(V)" },
    dfs: { time: "O(V + E)", space: "O(V)" },
  };

type AlgorithmInfo = {
  description: string;
  properties: { label: string; value: string }[];
};

const graphInfo: Record<"bfs" | "dfs", AlgorithmInfo> = {
  bfs: {
    description:
      "BFS uses a queue to explore a graph level by level. Starting from the source, it visits all neighbors at distance 1 before any at distance 2, guaranteeing the shortest path in an unweighted graph. Each node is enqueued once and dequeued once.",
    properties: [
      { label: "Data structure", value: "Queue (FIFO)" },
      { label: "Traversal order", value: "Level by level" },
      { label: "Shortest path", value: "Yes (unweighted)" },
      { label: "Memory usage", value: "Can be high (stores entire frontier)" },
    ],
  },
  dfs: {
    description:
      "DFS uses a stack (or recursion) to explore as deep as possible along each branch before backtracking. It follows one path all the way to a dead end, then unwinds to try the next branch. This makes it natural for problems involving all possible paths or connected components.",
    properties: [
      { label: "Data structure", value: "Stack (LIFO) / recursion" },
      { label: "Traversal order", value: "Depth first" },
      { label: "Shortest path", value: "No" },
      { label: "Memory usage", value: "Low (proportional to max depth)" },
    ],
  },
};

const sortInfo: Record<SortAlgorithm, AlgorithmInfo> = {
  bubble: {
    description:
      'Bubble sort repeatedly scans the array, comparing adjacent pairs and swapping them if out of order. Each full pass "bubbles" the largest unsorted element to its final position at the end. The algorithm can terminate early if a pass completes with no swaps.',
    properties: [
      { label: "Stable", value: "Yes" },
      { label: "In-place", value: "Yes" },
      { label: "Adaptive", value: "Yes (early exit)" },
      { label: "Swaps", value: "O(n²) worst case" },
    ],
  },
  selection: {
    description:
      "Selection sort divides the array into a sorted left portion and unsorted right portion. On each pass it scans the unsorted portion for the minimum element, then swaps it into the next sorted position. It always makes exactly n−1 swaps regardless of input order.",
    properties: [
      { label: "Stable", value: "No" },
      { label: "In-place", value: "Yes" },
      { label: "Adaptive", value: "No" },
      { label: "Swaps", value: "O(n) — minimal writes" },
    ],
  },
  insertion: {
    description:
      "Insertion sort builds a sorted prefix one element at a time. For each new element it shifts all larger sorted elements one position right, then drops the element into the gap. It's efficient on nearly-sorted data and is used as the base case in hybrid sorts like Timsort.",
    properties: [
      { label: "Stable", value: "Yes" },
      { label: "In-place", value: "Yes" },
      { label: "Adaptive", value: "Yes (O(n) on sorted input)" },
      { label: "Online", value: "Yes (sorts as data arrives)" },
    ],
  },
  merge: {
    description:
      "Merge sort is a divide-and-conquer algorithm. It repeatedly splits the array in half until subarrays are trivially sorted (size 1), then merges adjacent sorted subarrays back together. This visualization uses bottom-up (iterative) merge sort, which avoids recursion overhead.",
    properties: [
      { label: "Stable", value: "Yes" },
      { label: "In-place", value: "No — needs O(n) buffer" },
      { label: "Adaptive", value: "No" },
      { label: "Parallelizable", value: "Yes (independent merges)" },
    ],
  },
  quick: {
    description:
      "Quick sort picks a pivot element (here: the last element, Lomuto scheme), partitions the array so everything smaller is left of the pivot and everything larger is right, then recursively sorts both sides. It's the fastest sorting algorithm in practice due to excellent cache locality.",
    properties: [
      { label: "Stable", value: "No" },
      { label: "In-place", value: "Yes (O(log n) stack)" },
      { label: "Adaptive", value: "Partially" },
      { label: "Worst case", value: "O(n²) on sorted input" },
    ],
  },
};

const sortUseCases: Record<SortAlgorithm, string[]> = {
  bubble: [
    "Simplest sorting algorithm, great for learning.",
    "Works well on nearly-sorted small arrays.",
    "O(n) best-case when already sorted.",
    "Never used in production due to O(n²) average.",
  ],
  selection: [
    "Always performs O(n²) comparisons regardless.",
    "Minimizes swaps — useful when writes are expensive.",
    "Not stable, but predictable performance.",
    "Good for small arrays or when memory is constrained.",
  ],
  insertion: [
    "Efficient for small or nearly-sorted data.",
    "Online algorithm — can sort as data arrives.",
    "Best-case O(n) when data is nearly sorted.",
    "Used as the base case in hybrid sorts like Timsort.",
  ],
  merge: [
    "Guaranteed O(n log n) performance.",
    "Stable sort — preserves relative order of equal elements.",
    "Great for linked lists and external sorting.",
    "Requires O(n) extra space.",
  ],
  quick: [
    "Fastest in practice for random data (cache friendly).",
    "O(n log n) average, O(n²) worst-case.",
    "In-place with O(log n) stack space.",
    "Used internally by most standard library sorts.",
  ],
};

const sortComplexity: Record<
  SortAlgorithm,
  { time: string; space: string; best: string }
> = {
  bubble: { time: "O(n²)", space: "O(1)", best: "O(n)" },
  selection: { time: "O(n²)", space: "O(1)", best: "O(n²)" },
  insertion: { time: "O(n²)", space: "O(1)", best: "O(n)" },
  merge: { time: "O(n log n)", space: "O(n)", best: "O(n log n)" },
  quick: { time: "O(n log n)", space: "O(log n)", best: "O(n log n)" },
};

const sortLeetcode: Record<SortAlgorithm, PracticeLink[]> = {
  bubble: [
    {
      title: "912. Sort an Array",
      href: "https://leetcode.com/problems/sort-an-array/",
    },
    {
      title: "75. Sort Colors",
      href: "https://leetcode.com/problems/sort-colors/",
    },
  ],
  selection: [
    {
      title: "912. Sort an Array",
      href: "https://leetcode.com/problems/sort-an-array/",
    },
    {
      title: "215. Kth Largest Element in an Array",
      href: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    },
  ],
  insertion: [
    {
      title: "147. Insertion Sort List",
      href: "https://leetcode.com/problems/insertion-sort-list/",
    },
    {
      title: "75. Sort Colors",
      href: "https://leetcode.com/problems/sort-colors/",
    },
  ],
  merge: [
    {
      title: "148. Sort List",
      href: "https://leetcode.com/problems/sort-list/",
    },
    {
      title: "88. Merge Sorted Array",
      href: "https://leetcode.com/problems/merge-sorted-array/",
    },
    {
      title: "23. Merge k Sorted Lists",
      href: "https://leetcode.com/problems/merge-k-sorted-lists/",
    },
  ],
  quick: [
    {
      title: "215. Kth Largest Element in an Array",
      href: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    },
    {
      title: "75. Sort Colors",
      href: "https://leetcode.com/problems/sort-colors/",
    },
    {
      title: "912. Sort an Array",
      href: "https://leetcode.com/problems/sort-an-array/",
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

const SAMPLE_SORT_ARRAY = [
  38, 27, 43, 3, 9, 82, 10, 21, 14, 55, 31, 67, 72, 4, 18, 60,
];

const SORT_ALGORITHMS: SortAlgorithm[] = [
  "bubble",
  "selection",
  "insertion",
  "merge",
  "quick",
];

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function CollapsibleCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-800/50 transition-colors"
      >
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </h3>
        <span
          className="text-slate-500 text-xs transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "600px" : "0px" }}
      >
        <div className="px-4 pb-4 pt-1">{children}</div>
      </div>
    </div>
  );
}

function HowItWorks({ info }: { info: AlgorithmInfo }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-300 leading-relaxed">
        {info.description}
      </p>
      <div className="border-t border-slate-800 pt-3 space-y-1.5">
        {info.properties.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <span className="text-slate-500 shrink-0">{label}</span>
            <span className="text-slate-200 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UseCaseList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-slate-300 flex gap-2">
          <span className="text-cyan-500 mt-0.5 shrink-0">-</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PracticeLinks({ links }: { links: PracticeLink[] }) {
  return (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {link.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

function GraphSidebar({ algorithm }: { algorithm: "bfs" | "dfs" }) {
  const complexity = graphComplexity[algorithm];
  return (
    <>
      <CollapsibleCard title="How it works">
        <HowItWorks info={graphInfo[algorithm]} />
      </CollapsibleCard>

      <SidebarCard title="Algorithm Info">
        <div className="space-y-1">
          <p className="text-sm text-slate-300">
            <span className="text-slate-500">Algorithm:</span>{" "}
            <span className="font-semibold text-white">
              {algorithm.toUpperCase()}
            </span>
          </p>
          <p className="text-sm text-slate-300">
            <span className="text-slate-500">Graph size:</span>{" "}
            {sampleGraph.nodes.length} nodes, {sampleGraph.edges.length} edges
          </p>
        </div>
      </SidebarCard>

      <SidebarCard title="Complexity">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Time</span>
            <span className="font-mono text-slate-100">{complexity.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Space</span>
            <span className="font-mono text-slate-100">{complexity.space}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">V = vertices, E = edges</p>
        </div>
      </SidebarCard>

      <SidebarCard title={`When to use ${algorithm.toUpperCase()}`}>
        <UseCaseList items={graphUseCases[algorithm]} />
      </SidebarCard>

      <SidebarCard title="LeetCode Practice">
        <PracticeLinks links={graphLeetcode[algorithm]} />
      </SidebarCard>
    </>
  );
}

function SortSidebar({ algorithm }: { algorithm: SortAlgorithm }) {
  const complexity = sortComplexity[algorithm];
  const label = algorithm.charAt(0).toUpperCase() + algorithm.slice(1);
  return (
    <>
      <CollapsibleCard title="How it works">
        <HowItWorks info={sortInfo[algorithm]} />
      </CollapsibleCard>

      <SidebarCard title="Algorithm Controls">
        <div className="space-y-1">
          <p className="text-sm text-slate-300">
            <span className="text-slate-500">Algorithm:</span>{" "}
            <span className="font-semibold text-white">{label} Sort</span>
          </p>
          <p className="text-sm text-slate-300">
            <span className="text-slate-500">Array size:</span>{" "}
            {SAMPLE_SORT_ARRAY.length} elements
          </p>
        </div>
      </SidebarCard>

      <SidebarCard title="Complexity">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Time (avg)</span>
            <span className="font-mono text-slate-100">{complexity.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Time (best)</span>
            <span className="font-mono text-slate-100">{complexity.best}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Space</span>
            <span className="font-mono text-slate-100">{complexity.space}</span>
          </div>
        </div>
      </SidebarCard>

      <SidebarCard title={`When to use ${label} Sort`}>
        <UseCaseList items={sortUseCases[algorithm]} />
      </SidebarCard>

      <SidebarCard title="LeetCode Practice">
        <PracticeLinks links={sortLeetcode[algorithm]} />
      </SidebarCard>
    </>
  );
}

export default function AlgorithmLabPage() {
  const [category, setCategory] = useState<"graph" | "sorting">("graph");
  const [graphAlgorithm, setGraphAlgorithm] = useState<"bfs" | "dfs">("bfs");
  const [sortAlgorithm, setSortAlgorithm] = useState<SortAlgorithm>("bubble");
  const [startNode] = useState("A");

  const subBtnClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg border text-sm transition-colors ${
      active
        ? "bg-cyan-500 text-black border-cyan-400"
        : "border-slate-700 text-slate-300 hover:border-slate-500"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Algorithm <span className="text-cyan-400">Lab</span>
        </h1>
        <div className="flex gap-2">
          {(["graph", "sorting"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-cyan-500 text-black border-cyan-400"
                  : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-1 space-y-4">
          {category === "graph" ? (
            <GraphSidebar algorithm={graphAlgorithm} />
          ) : (
            <SortSidebar algorithm={sortAlgorithm} />
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-4">
            {category === "graph" ? (
              <>
                <div className="flex gap-2">
                  {(["bfs", "dfs"] as const).map((alg) => (
                    <button
                      key={alg}
                      onClick={() => setGraphAlgorithm(alg)}
                      className={subBtnClass(graphAlgorithm === alg)}
                    >
                      {alg.toUpperCase()}
                    </button>
                  ))}
                </div>
                <AlgorithmPlayer
                  key={graphAlgorithm}
                  graph={sampleGraph}
                  algorithm={graphAlgorithm}
                  startNode={startNode}
                />
              </>
            ) : (
              <>
                <div className="flex gap-2 flex-wrap">
                  {SORT_ALGORITHMS.map((alg) => (
                    <button
                      key={alg}
                      onClick={() => setSortAlgorithm(alg)}
                      className={subBtnClass(sortAlgorithm === alg)}
                    >
                      {alg.charAt(0).toUpperCase() + alg.slice(1)} Sort
                    </button>
                  ))}
                </div>
                <SortingPlayer
                  key={sortAlgorithm}
                  algorithm={sortAlgorithm}
                  array={SAMPLE_SORT_ARRAY}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
