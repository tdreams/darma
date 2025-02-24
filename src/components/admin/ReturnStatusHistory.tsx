import { trpc } from "@/lib/trpc";

// components/admin/ReturnStatusHistory.tsx
export function ReturnStatusHistory({ returnId }: { returnId: number }) {
  const { data: history } = trpc.getReturnStatusHistory.useQuery({ returnId });

  if (!history?.length) {
    return <div className="p-4 text-gray-500">No status history available</div>;
  }

  return (
    <div className="divide-y">
      {history.map((entry) => (
        <div key={entry.id} className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{entry.status}</span>
            <span className="text-sm text-gray-500">
              {new Date(entry.createdAt).toLocaleDateString()}
            </span>
          </div>
          {entry.notes && (
            <p className="mt-1 text-sm text-gray-600">{entry.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}
