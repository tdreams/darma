// components/dashboard/ReturnStatistics.tsx
import { motion } from "framer-motion";
import { item } from "@/utils/dashboardContents";
import { MapPin } from "lucide-react";
import { Button } from "../ui/button";

export default function ReturnStatistics() {
  return (
    <motion.div
      variants={item}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <h2 className="text-xl font-semibold mb-4">Preferred Location</h2>
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">Not set</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            Set Location
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Set your preferred drop-off location for faster returns
        </p>
      </div>
    </motion.div>
  );
}
