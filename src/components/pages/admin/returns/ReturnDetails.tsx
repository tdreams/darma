// src/pages/admin/returns/ReturnDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { trpc } from "@/lib/trpc";
import { StatusUpdateForm } from "@/components/admin/StatusUpdateForm";
import { ReturnStatusHistory } from "@/components/admin/ReturnStatusHistory";
import { ReturnStatus } from "@/types/returns";

import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Image as ImageIcon,
  QrCode,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

export default function ReturnDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const returnId = Number(id);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const utils = trpc.useUtils();
  const { data: returnData, isLoading } = trpc.getReturnDetails.useQuery(
    { returnId },
    { enabled: !!returnId && isLoaded }
  );

  const updateStatus = trpc.updateReturnStatus.useMutation({
    onSuccess: () => {
      utils.getReturnDetails.invalidate({ returnId });
      utils.getReturnStatusHistory.invalidate({ returnId });
    },
  });

  const isAdmin = user?.publicMetadata.role === "admin";

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      navigate("/");
    }
  }, [isLoaded, isAdmin, navigate]);

  if (!isLoaded || isLoading) {
    return <ReturnDetailsSkeleton />;
  }

  if (!returnData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Package className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">
          Return not found
        </h2>
        <p className="text-gray-500 mb-4">
          The return you're looking for doesn't exist
        </p>
        <Button onClick={() => navigate("/admin/returns")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Returns
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/returns")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Return #{returnData.id}
            </h1>
            <p className="text-gray-500">
              Created on {new Date(returnData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className={`${
            statusColors[returnData.status as keyof typeof statusColors]
          } text-sm px-3 py-1`}
        >
          {returnData.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Return Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Return Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  icon={Package}
                  label="Item Size"
                  value={returnData.itemSize}
                />
                <DetailItem
                  icon={Calendar}
                  label="Pickup Date"
                  value={returnData.pickupDate}
                />
                <DetailItem
                  icon={Clock}
                  label="Time Slot"
                  value={returnData.timeSlot || "N/A"}
                />
                <DetailItem
                  icon={DollarSign}
                  label="Amount"
                  value={`$${(returnData.amount / 100).toFixed(2)}`}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Additional Information</h4>
                <div className="grid grid-cols-1 gap-2">
                  <DetailItem
                    icon={QrCode}
                    label="QR Code"
                    value={
                      <a
                        href={returnData.qrCodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View QR Code
                      </a>
                    }
                  />
                  {returnData.imageUrl && (
                    <DetailItem
                      icon={ImageIcon}
                      label="Item Image"
                      value={
                        <a
                          href={returnData.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Image
                        </a>
                      }
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Update</CardTitle>
              <CardDescription>
                Update the current status of this return
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusUpdateForm
                returnId={returnData.id}
                currentStatus={returnData.status as ReturnStatus}
                onUpdate={async (status, notes) => {
                  if (!user) return;
                  await updateStatus.mutateAsync({
                    returnId: returnData.id,
                    status,
                    notes,
                    adminId: user.id,
                    createdBy: user.id,
                  });
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Addresses */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pickup Address</CardTitle>
            </CardHeader>
            <CardContent>
              <AddressDisplay
                street={returnData.street}
                city={returnData.city}
                state={returnData.state}
                zipCode={returnData.zipCode}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Return Station</CardTitle>
            </CardHeader>
            <CardContent>
              <AddressDisplay
                street={returnData.returnStationStreet}
                city={returnData.returnStationCity}
                state={returnData.returnStationState}
                zipCode={returnData.returnStationZipCode}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Status History</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
            >
              {isHistoryExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>
          <CardContent
            className={`overflow-hidden transition-all duration-200 ${
              isHistoryExpanded ? "max-h-[800px]" : "max-h-[400px]"
            }`}
          >
            <ReturnStatusHistory returnId={returnData.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-2">
    <Icon className="h-4 w-4 text-gray-500 mt-1" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const AddressDisplay = ({
  street,
  city,
  state,
  zipCode,
}: {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}) => (
  <div className="flex items-start gap-3">
    <MapPin className="h-5 w-5 text-gray-500" />
    <div>
      <p className="font-medium">{street}</p>
      <p className="text-gray-500">
        {city}, {state} {zipCode}
      </p>
      <Button
        variant="link"
        className="p-0 h-auto text-blue-600"
        onClick={() =>
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${street} ${city} ${state} ${zipCode}`
            )}`,
            "_blank"
          )
        }
      >
        View on Map
      </Button>
    </div>
  </div>
);

const ReturnDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto p-6">
    <div className="flex items-center gap-4 mb-6">
      <Skeleton className="h-10 w-10" />
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32 mt-2" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
