// server/src/components/returnForm/steps/Step1PersonalInfo.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@clerk/clerk-react";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export function Step1PersonalInfo({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
  const { user } = useUser();
  const { setValue, watch } = useFormContext();
  const updateUser = trpc.updateUser.useMutation();

  // Watch both phone and savePhone values
  const phoneValue = watch("phone");
  const savePhoneValue = watch("savePhone");

  // Fetch user data
  const { data: userData, isLoading } = trpc.getUser.useQuery(user?.id || "", {
    enabled: !!user?.id,
    staleTime: 60_000,
  });

  // Populate form fields when data loads
  useEffect(() => {
    if (userData) {
      setValue("fullName", userData.fullName);
      setValue("email", userData.email);
      if (userData.phone) {
        setValue("phone", userData.phone);
        setValue("savePhone", true);
      }
    }
  }, [userData, setValue]);

  // Handle phone saving
  const handleSavePhoneChange = async (checked: boolean) => {
    setValue("savePhone", checked);

    if (checked && user?.id && phoneValue) {
      try {
        await updateUser.mutateAsync({
          clerkId: user.id,
          phone: phoneValue,
          shouldSavePhone: true,
        });
        console.log("Phone number saved successfully");
      } catch (error) {
        console.error("Failed to save phone number:", error);
        // Revert checkbox if save failed
        setValue("savePhone", false);
        alert("Failed to save phone number. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Your name"
            {...register("fullName", { required: "Full name is required" })}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="me@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={userData?.phone || "Enter phone number"}
            {...register("phone", {
              pattern: {
                value: /^[\d\s()-]+$/,
                message: "Please enter a valid phone number",
              },
              validate: (value: string) =>
                !savePhoneValue || value
                  ? true
                  : "Phone number is required when saving",
            })}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}

          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="savePhone"
              checked={savePhoneValue}
              onCheckedChange={handleSavePhoneChange}
            />
            <Label
              htmlFor="savePhone"
              className="text-sm font-normal cursor-pointer"
            >
              {userData?.phone
                ? "Update saved phone number"
                : "Save phone number for future returns"}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
