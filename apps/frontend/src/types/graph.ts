export type GraphNode = {
  id: string;
  x: number;
  y: number;
};

export type GraphEdge = {
  from: string;
  to: string;
};

export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};