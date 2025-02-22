// src/components/admin/ReturnStatusHistory.tsx
import { trpc } from "@/lib/trpc";

export function ReturnStatusHistory({ returnId }: { returnId: number }) {
  const { data: history, isLoading } = trpc.getReturnStatusHistory.useQuery(
    { returnId },
    { enabled: !!returnId }
  );

  if (isLoading) {
    return <div>Loading history...</div>;
  }

  if (!history?.length) {
    return <div>No status history found.</div>;
  }

  return (
    <div className="space-y-4">
      {history.map((entry) => (
        <div key={entry.id} className="p-4 border rounded-lg">
          <div className="font-medium">{entry.status}</div>
          <div className="text-sm text-gray-500">
            {new Date(entry.createdAt).toLocaleString()}
          </div>
          {entry.notes && (
            <div className="mt-2 text-sm">
              <strong>Notes:</strong> {entry.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
