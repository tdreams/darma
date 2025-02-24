import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignUp: () => void;
}

export default function Modal({
  isOpen,
  onClose,
  onLogin,
  onSignUp,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const signUpButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        function handleTabKey(e: KeyboardEvent) {
          if (e.key === "Tab") {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        }

        document.addEventListener("keydown", handleTabKey);
        firstElement.focus();

        return () => {
          document.removeEventListener("keydown", handleTabKey);
        };
      }
    }
  }, [isOpen]);

  // Click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            // Responsive container:
            // On very small screens: max-w-sm, on small: max-w-md, on medium and up: max-w-lg.
            // "w-full" ensures it takes full available width, and "mx-4" adds horizontal margins.
            className="bg-white rounded-lg shadow-lg p-6 max-w-sm sm:max-w-md md:max-w-lg w-full mx-4"
          >
            <h2
              id="modal-title"
              className="text-xl font-bold text-blue-500 mb-4"
            >
              Access Restricted
            </h2>
            <p className="text-gray-600 mb-6">
              You need to log in or register to schedule a return
            </p>
            <div className="flex justify-end space-x-4">
              <Button ref={cancelButtonRef} variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button ref={loginButtonRef} variant="outline" onClick={onLogin}>
                Log In
              </Button>
              <Button ref={signUpButtonRef} onClick={onSignUp}>
                Sign Up
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
