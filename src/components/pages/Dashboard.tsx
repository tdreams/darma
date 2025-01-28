import { Button } from "../ui/button";
import { MapPin, PlusCircle, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { container, item } from "@/utils/dashboardContents";
import WelcomeCard from "../dashboard/WelcomeCard";
import SideBar from "../dashboard/SideBar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Main Content Area */}
          <div className="md:col-span-8 space-y-6">
            {/* Welcome Card */}
            <WelcomeCard />
          </div>

          {/* Sidebar */}
          <SideBar />
        </motion.div>
      </div>
    </div>
  );
}
