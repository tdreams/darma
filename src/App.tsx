import { Route, Routes } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

// Import components
import Features from "./components/Features";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import NotifyMe from "./components/NotifyMe";
import ReturnForm from "./components/ReturnForm";
import FAQ from "./components/FAQ";
import SignUpPage from "./components/SignUpPage";
import SignInPage from "./components/SignInPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/pages/Dashboard";
import ReturnDetails from "./components/pages/admin/returns/ReturnDetails";
import AdminLayout from "./components/AdminLayout";
import AdminReturnsPage from "./components/pages/admin/AdminReturnsPage";

import { Toaster } from "sonner";
import ScrollToHash from "./utils/ScrollToHash";
import MyReturns from "./components/pages/MyReturns";
import UserReturnDetails from "./components/pages/userReturnDetails";
import { NotificationProvider } from "./context/NotificationContext";
import SuccessPage from "./components/pages/SuccesPage";

function App() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Toaster position="bottom-right" />
        <ScrollToHash />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Features />
                  <HowItWorks />
                  <NotifyMe />
                </>
              }
            />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/register/*" element={<SignUpPage />} />

            {/* Protected Routes */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule-return"
              element={
                <ProtectedRoute>
                  <ReturnForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/my-returns/:id"
              element={
                <ProtectedRoute>
                  <UserReturnDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/my-returns"
              element={
                <ProtectedRoute>
                  <MyReturns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <SuccessPage />
                </ProtectedRoute>
              }
            />

            <Route path="/faq" element={<FAQ />} />

            {/* Catch-all Route */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                      404
                    </h1>
                    <p className="text-gray-600">Page not found</p>
                  </div>
                </div>
              }
            />
            {/* Admin Routes */}

            <Route path="/admin" element={<AdminLayout />}>
              {/* Route for listing all returns */}
              <Route path="returns" element={<AdminReturnsPage />} />
              <Route path="returns/:id" element={<ReturnDetails />} />
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </NotificationProvider>
  );
}

export default App;
