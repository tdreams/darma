// components/NotificationPanel.tsx
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Bell, Check, CheckCheck, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";

interface NotificationPanelProps {
  isMobile?: boolean;
}

type FilterStatus = "all" | "unread";

export function NotificationPanel({
  isMobile = false,
}: NotificationPanelProps) {
  const { unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const { data, isLoading, error } = trpc.getAdminNotifications.useQuery({
    limit: 20,
    unreadOnly: statusFilter === "unread",
  });

  const filteredNotifications = data?.notifications?.filter((notification) => {
    if (statusFilter === "unread") {
      return !notification.isRead;
    }
    return true;
  });

  const formatNotificationDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const NotificationList = () => (
    <div className={cn("space-y-2", isMobile ? "px-0" : "px-3")}>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 h-16 rounded-lg"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load notifications</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      ) : !filteredNotifications?.length ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            {statusFilter === "unread"
              ? "No unread notifications"
              : "No notifications yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-3 border-b last:border-b-0 transition-colors",
                isMobile ? "" : "rounded-lg border",
                notification.isRead
                  ? "bg-white"
                  : "bg-blue-50 hover:bg-blue-100"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-2 h-2 mt-2 rounded-full flex-shrink-0",
                    notification.isRead ? "bg-gray-300" : "bg-blue-500"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm line-clamp-2",
                      notification.isRead
                        ? "text-gray-600"
                        : "text-gray-900 font-medium"
                    )}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatNotificationDate(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 h-8 hover:bg-blue-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Mobile version
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 px-3"
          >
            <div className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            <span className="text-sm">Notifications</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-xl">
          <div className="sticky top-0 bg-white border-b z-10">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg">Notifications</SheetTitle>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="font-normal">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsRead()}
                  className="text-sm"
                >
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
            <div className="px-4 pb-2">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex-1 text-sm",
                    statusFilter === "all" && "bg-gray-100"
                  )}
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex-1 text-sm",
                    statusFilter === "unread" && "bg-gray-100"
                  )}
                  onClick={() => setStatusFilter("unread")}
                >
                  Unread
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[calc(85vh-120px)] pt-2">
            <NotificationList />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop version
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsRead()}
                className="flex items-center gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <NotificationList />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
