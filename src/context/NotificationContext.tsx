// contexts/NotificationContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

interface NotificationContextType {
  unreadCount: number;
  refreshNotifications: () => void;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const utils = trpc.useContext();

  const { data: count } = trpc.getUnreadNotificationCount.useQuery(undefined, {
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsReadMutation = trpc.markNotificationAsRead.useMutation({
    onSuccess: () => {
      utils.getUnreadNotificationCount.invalidate();
      utils.getAdminNotifications.invalidate();
    },
  });

  const markAllAsReadMutation = trpc.markAllNotificationsAsRead.useMutation({
    onSuccess: () => {
      utils.getUnreadNotificationCount.invalidate();
      utils.getAdminNotifications.invalidate();
    },
  });

  useEffect(() => {
    if (typeof count === "number") {
      setUnreadCount(count);
    }
  }, [count]);

  const refreshNotifications = () => {
    utils.getUnreadNotificationCount.invalidate();
    utils.getAdminNotifications.invalidate();
  };

  const markAsRead = async (notificationId: number) => {
    await markAsReadMutation.mutateAsync({ notificationId });
  };

  const markAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
