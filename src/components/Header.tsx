// components/Header.tsx
import {
  Package,
  Menu,
  Home,
  LayoutDashboard,
  Mail,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  useAuth,
  UserButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationPanel } from "./NotificationPanel";
import { useNotifications } from "@/context/NotificationContext";

export default function Header() {
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  // Check if user is admin
  const isAdmin = user?.publicMetadata.role === "admin";

  const MobileUserActions = () => (
    <div className="absolute bottom-0 left-0 right-0 border-t bg-gray-50 p-4">
      <div className="flex items-center gap-4 mb-4">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: { avatarBox: "w-10 h-10" },
          }}
        />
        <div className="flex-1">
          <p className="font-medium text-gray-900">{user?.fullName}</p>
          <p className="text-sm text-gray-500">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
      {isAdmin && (
        <div className="mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            Admin Access
          </span>
        </div>
      )}
    </div>
  );

  // Base navigation items
  const baseNavigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  // Admin navigation item
  const adminNavigationItem = {
    path: "/admin/returns",
    label: "Admin Panel",
    icon: Settings,
  };

  // Combine navigation items based on admin status
  const navigationItems = isAdmin
    ? [...baseNavigationItems, adminNavigationItem]
    : baseNavigationItems;

  const isActive = (path: string) => location.pathname.startsWith(path);

  if (!isLoaded) {
    return <div className="h-16 bg-white shadow-sm animate-pulse" />;
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Package className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Darma
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.path === "/admin/returns" && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Admin
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedOut>
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <NotificationPanel />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-[300px] p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Package className="h-6 w-6 text-blue-600" />
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      Darma
                    </span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.path === "/admin/returns" && (
                          <span className="ml-auto px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Admin
                          </span>
                        )}
                      </Link>
                    ))}
                  </nav>

                  {/* Notifications Section */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 px-3 mb-2">
                      Notifications
                    </h3>
                    <NotificationPanel isMobile />
                  </div>
                </div>

                {/* Sign In/Out Section */}
                <div className="mt-auto">
                  <SignedIn>
                    <MobileUserActions />
                  </SignedIn>
                  <SignedOut>
                    <div className="p-4 border-t bg-gray-50">
                      <div className="grid gap-2">
                        <Link to="/login">
                          <Button variant="outline" className="w-full">
                            Login
                          </Button>
                        </Link>
                        <Link to="/register">
                          <Button className="w-full">Register</Button>
                        </Link>
                      </div>
                    </div>
                  </SignedOut>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
