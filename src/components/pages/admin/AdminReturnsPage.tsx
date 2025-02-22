// src/pages/admin/returns/AdminReturnsPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "@/lib/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReturnStatusFilter } from "@/types/returns";

export default function AdminReturnsPage() {
  const navigate = useNavigate();
  // Filter state – default "all" returns
  const [statusFilter, setStatusFilter] = useState<ReturnStatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState<string>("");

  // TRPC query: make sure to create a procedure `getAllReturns`
  const {
    data: returnsList,
    isLoading,
    refetch,
  } = trpc.getAllReturns.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    sortOrder,
    search,
  });

  const handleReturnClick = (returnId: number) => {
    navigate(`/admin/returns/${returnId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Returns</h1>

      {/* Filter and sort controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-4 items-center">
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as ReturnStatusFilter)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="pickup_ready">Ready for Pickup</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Selector */}
          <Select
            value={sortOrder}
            onValueChange={(val) => setSortOrder(val as "asc" | "desc")}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Oldest</SelectItem>
              <SelectItem value="desc">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Input */}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search returns..."
          className="w-full md:w-64"
        />

        <Button onClick={() => refetch()}>Apply</Button>
      </div>

      {/* Returns Table */}
      {isLoading ? (
        <div>Loading returns...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returnsList?.map((ret) => (
                <tr
                  key={ret.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleReturnClick(ret.id)}
                >
                  <td className="px-4 py-2 whitespace-nowrap">{ret.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{ret.status}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(ret.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {ret.pickupDate}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {ret.customerName || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
