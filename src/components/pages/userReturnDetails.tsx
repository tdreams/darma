// pages/UserReturnDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, MapPin, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  pickup_ready: "bg-yellow-100 text-yellow-800",
  processing: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
  rejected: "bg-red-100 text-red-800",
};

export default function UserReturnDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const returnId = Number(id);

  const { data: returnData, isLoading } = trpc.getUserReturnDetails.useQuery(
    {
      returnId,
      clerkId: user?.id || "",
    },
    {
      enabled: !!user?.id && !!returnId,
      onError: (error) => {
        // Handle unauthorized or not found errors
        if (error) {
          navigate("/dashboard/my-returns");
        }
      },
    }
  );

  // Update navigation paths
  const handleBack = () => navigate("/dashboard/my-returns");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!returnData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Return Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The return you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/my-returns")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Returns
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Returns
            </Button>
            <Badge
              className={
                statusColors[returnData.status as keyof typeof statusColors]
              }
            >
              {returnData.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Return Details */}
          <Card className="mb-6">
            <CardHeader>
              <h1 className="text-2xl font-bold">Return #{returnData.id}</h1>
              <p className="text-gray-600">
                Created on {new Date(returnData.createdAt).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Item Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Item Size</p>
                  <p className="font-medium">{returnData.itemSize}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Express Pickup</p>
                  <p className="font-medium">
                    {returnData.expressPickup ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {/* Addresses */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Pickup Address</h3>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p>{returnData.street}</p>
                      <p>{`${returnData.city}, ${returnData.state} ${returnData.zipCode}`}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Return Station</h3>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p>{returnData.returnStationStreet}</p>
                      <p>{`${returnData.returnStationCity}, ${returnData.returnStationState} ${returnData.returnStationZipCode}`}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Details */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>Pickup Date: {returnData.pickupDate}</span>
                </div>
                {returnData.timeSlot && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>Time Slot: {returnData.timeSlot}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">Status History</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnData.statusHistory?.map(
                  (history: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                      <div>
                        <p className="font-medium">
                          {history.status.replace("_", " ").toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(history.createdAt).toLocaleString()}
                        </p>
                        {history.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            {history.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
