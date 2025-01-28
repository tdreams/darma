// utils/quickActionContents.ts
import { QuickActionItem } from "@/types/dashboard";
import { Calendar, MapPin, PlusCircle } from "lucide-react";

export const actions: QuickActionItem[] = [
  {
    icon: PlusCircle,
    label: "New Return",
    path: "/schedule-return",
  },
  {
    icon: MapPin,
    label: "Find Drop-off",
    path: "/locations",
  },
  {
    icon: Calendar,
    label: "Schedule Pickup",
    path: "/schedule-pickup",
  },
];
