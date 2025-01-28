import { Package, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { HashLink } from "react-router-hash-link";
import { useAuth, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { isLoaded } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    // Add your notifications here
    // Example:
    { id: 1, message: "Your return has been processed", date: "2024-03-20" },
  ];

  if (!isLoaded) {
    return (
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <span>Loading...</span>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm relative">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <HashLink to="/" className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Darma</span>
        </HashLink>

        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <HashLink
                smooth
                to="/#features"
                className="text-gray-600 hover:text-blue-600"
                aria-label="Navigate to Features section"
              >
                Features
              </HashLink>
            </li>
            <li>
              <HashLink
                smooth
                to="/#how-it-works"
                className="text-gray-600 hover:text-blue-600"
                aria-label="Navigate to How It Works section"
              >
                How-it-works
              </HashLink>
            </li>
            <li>
              <HashLink
                smooth
                to="/#notify-me"
                className="text-gray-600 hover:text-blue-600"
                aria-label="Navigate to Contact section"
              >
                Contact
              </HashLink>
            </li>

            <SignedOut>
              <li>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </li>
            </SignedOut>

            <SignedIn>
              <li>
                <button
                  className="relative p-2 text-gray-400 hover:text-gray-500"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-label="Notifications"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400" />
                  )}
                </button>
              </li>
              <li>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </li>
            </SignedIn>
          </ul>
        </nav>

        {/* Notifications Panel */}
        <AnimatePresence>
          {showNotifications && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setShowNotifications(false)}
              />

              {/* Notifications Panel */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute right-4 top-16 w-80 bg-white rounded-lg shadow-lg z-50"
              >
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-400 mt-1">
                          {notification.date}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
