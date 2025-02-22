export type ReturnStatus =
  | "scheduled"
  | "pickup_ready"
  | "processing"
  | "completed"
  | "cancelled"
  | "rejected";

export type ReturnStatusFilter =
  | "all"
  | "scheduled"
  | "pickup_ready"
  | "processing"
  | "completed"
  | "cancelled"
  | "rejected";
