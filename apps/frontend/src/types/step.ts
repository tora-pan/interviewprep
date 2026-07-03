export type Step =
  | { type: "init"; payload?: any }
  | { type: "visit_node"; node: string }
  | { type: "discover_edge"; from: string; to: string }
  | { type: "queue_push"; node: string }
  | { type: "queue_pop"; node: string }
  | { type: "set_active_path"; nodes: string[] }
  | { type: "done" };