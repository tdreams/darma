// components/admin/StatusUpdateForm.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ReturnStatus } from "@/types/returns";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const statusOptions = [
  {
    value: "scheduled",
    label: "Scheduled",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "pickup_ready",
    label: "Ready for Pickup",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800",
  },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
];

export function StatusUpdateForm({
  currentStatus,
  onUpdate,
}: {
  returnId: number;
  currentStatus: ReturnStatus;
  onUpdate: (status: ReturnStatus, notes?: string) => Promise<void>;
}) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ReturnStatus>(currentStatus);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(status !== currentStatus || notes.trim() !== "");
  }, [status, notes, currentStatus]);

  const handleSubmit = async () => {
    if (!hasChanges) {
      toast.error("No changes to update");
      return;
    }

    setLoading(true);
    try {
      await onUpdate(status, notes);
      toast.success("Status updated successfully");
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStatusBadge = (status: ReturnStatus) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return (
      <Badge variant="secondary" className={`${option?.color} font-medium`}>
        {option?.label || status}
      </Badge>
    );
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0 space-y-6">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="p-0 h-auto hover:bg-transparent"
              onClick={() => navigate("/admin/returns")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm">Back to Returns</span>
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Current Status:</span>
              {getCurrentStatusBadge(currentStatus)}
            </div>
          </div>
          <Separator className="my-4" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              New Status
            </Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ReturnStatus)}
            >
              <SelectTrigger className="w-full bg-white border-gray-200">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          option.color.split(" ")[0]
                        }`}
                      />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Update Notes
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this status change"
              className="min-h-[100px] resize-none bg-white border-gray-200"
              maxLength={500}
            />
            <div className="flex justify-end">
              <span className="text-sm text-gray-500">
                {notes.length} / 500 characters
              </span>
            </div>
          </div>

          {hasChanges && (
            <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
              <p className="text-sm text-blue-700">
                You have unsaved changes. Don't forget to update the status.
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setStatus(currentStatus);
                setNotes("");
              }}
              disabled={loading || !hasChanges}
              className="w-24"
            >
              Reset
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !hasChanges}
              className="w-32"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Status"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
