// components/dashboard/SideBar.tsx
import QuickAction from "./QuickAction";

import ReturnStatistics from "./ReturnStatistics";

export default function SideBar() {
  return (
    <div className="md:col-span-4 space-y-6">
      <QuickAction />
      <ReturnStatistics />
    </div>
  );
}
