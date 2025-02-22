//src/pages/admin/returns/ReturnDetails.tsx

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { trpc } from "@/lib/trpc";
import { StatusUpdateForm } from "@/components/admin/StatusUpdateForm";
import { ReturnStatusHistory } from "@/components/admin/ReturnStatusHistory";
import { ReturnStatus } from "@/types/returns";

export default function ReturnDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const returnId = Number(id);

  //Fetch return data
  const { data: returnData, isLoading } = trpc.getReturnDetails.useQuery(
    { returnId },
    { enabled: !!returnId && isLoaded }
  );
  //Status update mutation
  const updateStatus = trpc.updateReturnStatus.useMutation();

  //Check admin status
  const isAdmin = user?.publicMetadata.role === "admin";

  //Redirectr non admins
  useEffect(() => {
    if (isLoaded && !isAdmin) {
      navigate("/");
    }
  }, [isLoaded, isAdmin, navigate]);

  if (!isLoaded || isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!returnData) {
    return <div className="p-4">Return not found</div>;
  }
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Return #{returnData.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Update Status</h2>
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
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Status History</h2>
          <ReturnStatusHistory returnId={returnData.id} />
        </div>
      </div>
    </div>
  );
}
