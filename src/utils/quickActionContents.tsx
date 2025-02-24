// utils/quickActionContents.ts
import { QuickActionItem } from "@/types/dashboard";
import { Package, PlusCircle } from "lucide-react";

export const actions: QuickActionItem[] = [
  {
    icon: PlusCircle,
    label: "New Return",
    path: "/schedule-return",
  },
  {
    icon: Package,
    label: "My Returns",
    path: "/dashboard/my-returns",
  },
];
