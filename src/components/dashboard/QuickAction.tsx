// components/dashboard/QuickAction.tsx
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { item } from "@/utils/dashboardContents";
import { actions } from "@/utils/quickActionContents";

export default function QuickAction() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={item}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-between group hover:bg-gray-50"
            onClick={() => navigate(action.path)}
          >
            <div className="flex items-center">
              <action.icon className="w-5 h-5 mr-2 text-blue-600" />
              {action.label}
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
