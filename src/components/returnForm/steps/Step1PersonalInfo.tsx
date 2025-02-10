import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const { setValue } = useFormContext();

  // 1. Fetch user data using tRPC
  const {
    data: userData,
    isLoading,
    isError,
  } = trpc.getUser.useQuery(user?.id || "", {
    enabled: !!user?.id, // Only fetch when user is available
    staleTime: 60_000, // Cache for 1 minute
  });

  // 2. Populate form fields when data loads
  useEffect(() => {
    if (userData) {
      setValue("fullName", userData.fullName);
      setValue("email", userData.email);
      // Since we no longer fetch phone, you can either:
      // - Remove the phone input from the form altogether, or
      // - Set it to an empty string by default.
      setValue("phone", "");
    }
  }, [userData, setValue]);

  // 3. Handle loading and error states
  if (isLoading) {
    return <div>Loading your information...</div>;
  }

  if (isError) {
    return <div>Error loading your information</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
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
        <div>
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

        {/* Optionally, remove or keep the phone input.
            If you want to allow the user to enter a phone number, you can leave it here.
            Otherwise, you can remove this section. */}
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="(123) 456-7890"
            {...register("phone", { required: "Phone number is required" })}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
