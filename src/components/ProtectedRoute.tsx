import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import Modal from "./Modal";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  // Show modal immediately if user is not signed in
  useEffect(() => {
    if (!isSignedIn) {
      setShowModal(true);
    }
  }, [isSignedIn]);

  const handleLogin = () => {
    navigate("/login");
    setShowModal(false);
  };

  const handleSignUp = () => {
    navigate("/register");
    setShowModal(false);
  };

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Modal
          isOpen={showModal}
          onClose={() => navigate("/")} // Redirect to home when closing
          onLogin={handleLogin}
          onSignUp={handleSignUp}
        />
      </SignedOut>
    </>
  );
}
