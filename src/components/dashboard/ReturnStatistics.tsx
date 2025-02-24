// components/dashboard/ReturnStatistics.tsx
import { motion } from "framer-motion";
import { item } from "@/utils/dashboardContents";
import { MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { useUser } from "@clerk/clerk-react";
import { trpc } from "@/lib/trpc";
import Loading from "./Loading";
import { useState } from "react";
import PreferredLocationModal from "../PreferredLocationModal"; // Import the modal

export default function ReturnStatistics() {
  const { user } = useUser();
  const { data: preferredLocation, isLoading } =
    trpc.getPreferredReturnStation.useQuery(user?.id || "", {
      enabled: !!user?.id,
    });

  const [modalOpen, setModalOpen] = useState(false);
  const hasPreferredLocation = preferredLocation?.returnStationStreet;

  if (isLoading) {
    return <Loading />;
  }
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
            {hasPreferredLocation ? (
              <span className="text-gray-600">
                {preferredLocation.returnStationStreet},{" "}
                {preferredLocation.returnStationCity}
              </span>
            ) : (
              <span className="text-gray-600">Not set</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => setModalOpen(true)}
          >
            {hasPreferredLocation ? "Update Location" : "Set Location"}
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {hasPreferredLocation
            ? "Your preferred drop-off location is set"
            : "Set your preferred drop-off location for faster returns"}
        </p>
      </div>
      <PreferredLocationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </motion.div>
  );
}
