// components/PreferredLocationModal.tsx
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

interface PreferredLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PreferredLocationFormValues {
  returnStationStreet: string;
  returnStationCity: string;
  returnStationState: string;
  returnStationZipCode: string;
}

export default function PreferredLocationModal({
  isOpen,
  onClose,
}: PreferredLocationModalProps) {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PreferredLocationFormValues>();
  const modalRef = useRef<HTMLDivElement>(null);

  // TRPC mutation to update the user's preferred location
  const updateUser = trpc.updateUser.useMutation();
  // TRPC utils for invalidating queries
  const utils = trpc.useUtils();

  // Prepopulate fields using getUser
  const { data: userData } = trpc.getUser.useQuery(user?.id || "", {
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (userData) {
      setValue("returnStationStreet", userData.returnStationStreet || "");
      setValue("returnStationCity", userData.returnStationCity || "");
      setValue("returnStationState", userData.returnStationState || "");
      setValue("returnStationZipCode", userData.returnStationZipCode || "");
    }
  }, [userData, setValue]);

  const onSubmit: SubmitHandler<PreferredLocationFormValues> = async (data) => {
    if (!user) return;
    try {
      await updateUser.mutateAsync({
        clerkId: user.id,
        returnStationStreet: data.returnStationStreet,
        returnStationCity: data.returnStationCity,
        returnStationState: data.returnStationState,
        returnStationZipCode: data.returnStationZipCode,
        shouldSaveReturnStation: true,
      });
      toast.success("Location saved successfully");
      // Invalidate the query to refresh ReturnStatistics
      await utils.getPreferredReturnStation.invalidate(user.id);
      onClose();
      reset();
    } catch (error) {
      console.error("Failed to update location", error);
      toast.error("Failed to update location. Please try again.");
    }
  };

  // Close modal when clicking outside
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
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-sm sm:max-w-md md:max-w-lg w-full mx-4"
          >
            <h2
              id="modal-title"
              className="text-xl font-bold text-gray-800 mb-4"
            >
              Preferred Drop-Off Location
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="returnStationStreet">Street Address</Label>
                <Input
                  id="returnStationStreet"
                  placeholder="123 Main St"
                  {...register("returnStationStreet", {
                    required: "Street is required",
                  })}
                />
                {errors.returnStationStreet && (
                  <p className="text-red-500 text-sm">
                    {errors.returnStationStreet.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="returnStationCity">City</Label>
                <Input
                  id="returnStationCity"
                  placeholder="City"
                  {...register("returnStationCity", {
                    required: "City is required",
                  })}
                />
                {errors.returnStationCity && (
                  <p className="text-red-500 text-sm">
                    {errors.returnStationCity.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="returnStationState">State</Label>
                <Input
                  id="returnStationState"
                  placeholder="State"
                  {...register("returnStationState", {
                    required: "State is required",
                  })}
                />
                {errors.returnStationState && (
                  <p className="text-red-500 text-sm">
                    {errors.returnStationState.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="returnStationZipCode">ZIP Code</Label>
                <Input
                  id="returnStationZipCode"
                  placeholder="ZIP Code"
                  {...register("returnStationZipCode", {
                    required: "ZIP code is required",
                    pattern: {
                      value: /^\d{5}(-\d{4})?$/,
                      message: "Invalid ZIP code",
                    },
                  })}
                />
                {errors.returnStationZipCode && (
                  <p className="text-red-500 text-sm">
                    {errors.returnStationZipCode.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                {/* Cancel button simply closes modal without a toast */}
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Save Location</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
