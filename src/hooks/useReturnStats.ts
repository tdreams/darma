import { useUser } from "@clerk/clerk-react";
import { trpc } from "@/lib/trpc";

export function useReturnStats() {
  const { user } = useUser();
  return trpc.getReturnStats.useQuery(user?.id || "", {
    enabled: !!user?.id,
  });
}
