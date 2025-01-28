import { LucideIcon } from "lucide-react";

// types/dashboard.ts
export interface QuickStat {
  label: string;
  value: number;
}

export interface RecentActivity {
  id: string;
  type: "return_created" | "return_completed" | "return_cancelled";
  message: string;
  timestamp: Date;
}

export interface QuickActionItem {
  icon: LucideIcon;
  label: string;
  path: string;
}
