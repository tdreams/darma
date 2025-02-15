import { useReturnStats } from "@/hooks/useReturnStats";
import { statConfig } from "@/utils/statGridContents";
import { motion } from "framer-motion";
import Loading from "./Loading";

export default function StatGrid() {
  const { data: stats, isLoading } = useReturnStats();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statConfig.map((stat, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="bg-blue-500 bg-opacity-25 rounded-xl p-4 transition-all duration-200 hover:bg-opacity-30 cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <stat.icon className="w-6 h-6 text-blue-100" />
            <span className="text-sm text-blue-100">{stat.label}</span>
          </div>
          <p className="text-2xl font-bold mt-2 text-white">
            {stat.getValue(stats)}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
