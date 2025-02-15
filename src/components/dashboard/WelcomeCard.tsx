import { item } from "@/utils/dashboardContents";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Package, ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatGrid from "./StatGrid";
import { trpc } from "@/lib/trpc";
import Loading from "./Loading";

interface ReturnItem {
  id: number;
  status: string;
  itemSize: string;
  createdAt: string | null;
  returnStationStreet: string;
  returnStationCity: string;
}

export default function WelcomeCard() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const currentTime = new Date().getHours();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const { data: recentReturns, isLoading: isLoadingReturns } =
    trpc.getRecentReturns.useQuery(user?.id || "", {
      enabled: !!user?.id,
    });

  if (!isLoaded) {
    return (
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-4 bg-blue-500 rounded w-1/4 mb-4" />
        <div className="h-8 bg-blue-500 rounded w-3/4 mb-4" />
        <div className="h-4 bg-blue-500 rounded w-1/2" />
      </Card>
    );
  }

  if (isLoadingReturns) {
    return <Loading />;
  }

  const getGreeting = () => {
    if (currentTime < 12) return "Good morning";
    if (currentTime < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      variants={item}
      className="w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full transform translate-x-32 -translate-y-32 opacity-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full transform -translate-x-24 translate-y-24 opacity-20" />

        <CardHeader className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 opacity-75" />
            <span className="text-sm opacity-75">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <CardTitle className="text-3xl font-bold">
            {getGreeting()}, {user?.firstName || "User"}!
          </CardTitle>
          <CardDescription className="text-blue-100">
            Your return dashboard is ready. Start managing your returns
            efficiently.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          {/* Action Button */}
          <Button
            className="bg-white text-blue-600 hover:bg-blue-50 group flex items-center justify-center"
            onClick={() => navigate("/schedule-return")}
          >
            <Package className="w-4 h-4 mr-2" />
            Start New Return
            <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          {/* Stats Grid */}
          <StatGrid />
          {/* Recent Activity */}
          <div className="bg-blue-500 bg-opacity-25 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
            {recentReturns?.length ? (
              <div className="space-y-2">
                {recentReturns.map((return_: ReturnItem) => (
                  <div
                    key={return_.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4" />
                      <span>
                        {return_.itemSize} package to{" "}
                        {return_.returnStationCity}
                      </span>
                    </div>
                    <span className="text-blue-100">
                      {formatDate(return_.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-blue-100">
                No recent activity. Start by creating a new return.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
