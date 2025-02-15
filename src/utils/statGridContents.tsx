import { Clock, Package, TrendingUp } from "lucide-react";

// Define the static icon and label configuration
export const statConfig = [
  {
    icon: Package,
    label: "Active Returns",
    getValue: (stats: any) => stats?.activeReturns.toString() || "0",
  },
  {
    icon: Clock,
    label: "Processing Time",
    getValue: (stats: any) => `~${stats?.avgProcessingDays || 2} days`,
  },
  {
    icon: TrendingUp,
    label: "Completed",
    getValue: (stats: any) => stats?.completedReturns.toString() || "0",
  },
];
