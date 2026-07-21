export type Step =
  | { type: "init"; payload?: unknown }
  | { type: "visit_node"; node: string }
  | { type: "discover_edge"; from: string; to: string }
  | { type: "queue_push"; node: string }
  | { type: "queue_pop"; node: string }
  | { type: "set_active_path"; nodes: string[] }
  | { type: "done" }
  | { type: "sort_init"; array: number[] }
  | { type: "sort_compare"; i: number; j: number }
  | { type: "sort_swap"; i: number; j: number }
  | { type: "sort_overwrite"; index: number; value: number }
  | { type: "sort_set_pivot"; index: number }
  | { type: "sort_mark_sorted"; indices: number[] }
  | { type: "sort_done" };
