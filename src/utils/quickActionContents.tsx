// utils/quickActionContents.ts
import { QuickActionItem } from "@/types/dashboard";
import { Clock, Package, PlusCircle } from "lucide-react";

export const actions: QuickActionItem[] = [
  {
    icon: PlusCircle,
    label: "New Return",
    path: "/schedule-return",
  },
  {
    icon: Package,
    label: "Track Returns",
    path: "/track-returns",
  },
  {
    icon: Clock,
    label: "Return History",
    path: "/return-history",
  },
];
