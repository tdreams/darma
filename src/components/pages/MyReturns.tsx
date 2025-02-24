// pages/MyReturns.tsx
import { useUser } from "@clerk/clerk-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  Package,
  Search,
  FilterX,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  pickup_ready: "bg-yellow-100 text-yellow-800",
  processing: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
  rejected: "bg-red-100 text-red-800",
};

export default function MyReturns() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    data: returns,
    isLoading,
    isError,
  } = trpc.getRecentReturns.useQuery(user?.id || "", { enabled: !!user?.id });

  const filteredReturns = returns?.filter((ret) => {
    const matchesSearch =
      ret.id.toString().includes(search.toLowerCase()) ||
      ret.status.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || ret.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const ReturnCard = ({ return: ret }: { return: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer"
      onClick={() => navigate(`/dashboard/my-returns/${ret.id}`)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Return #{ret.id}</span>
          </div>
          <Badge
            className={statusColors[ret.status as keyof typeof statusColors]}
          >
            {ret.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(ret.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{ret.returnStationCity}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{ret.timeSlot || "No time slot selected"}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-600">
            View Details
          </span>
          <ChevronRight className="w-4 h-4 text-blue-600" />
        </div>
      </div>
    </motion.div>
  );

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Returns
            </h2>
            <p className="text-gray-600 mb-8">
              There was an error loading your returns. Please try again later.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Returns</h1>
            <p className="text-gray-600">
              View and manage all your return requests
            </p>
          </div>
          <Button onClick={() => navigate("/schedule-return")}>
            Schedule New Return
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search returns..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.keys(statusColors).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace("_", " ").toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(search || statusFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
              >
                <FilterX className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Returns Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredReturns?.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No returns found
            </h3>
            <p className="text-gray-600 mb-6">
              {search || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "You haven't created any returns yet"}
            </p>
            <Button onClick={() => navigate("/schedule-return")}>
              Schedule Your First Return
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReturns?.map((ret) => (
              <ReturnCard key={ret.id} return={ret} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
