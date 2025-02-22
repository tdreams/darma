// components/admin/StatusUpdateForm.tsx
import { useState } from "react";
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

export function StatusUpdateForm({
  currentStatus,
  onUpdate,
}: {
  returnId: number;
  currentStatus: ReturnStatus; // Use the ReturnStatus type here
  onUpdate: (status: ReturnStatus, notes?: string) => Promise<void>;
}) {
  const [status, setStatus] = useState<ReturnStatus>(currentStatus);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onUpdate(status, notes);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>New Status</Label>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as ReturnStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="pickup_ready">Ready for Pickup</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Update Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this status change"
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Updating..." : "Update Status"}
      </Button>
    </div>
  );
}
