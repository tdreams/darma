// server/src/components/returnForm/steps/Step2Address.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@clerk/clerk-react";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export function Step2Address({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
  const { user } = useUser();
  const { setValue, watch } = useFormContext();
  const updateUser = trpc.updateUser.useMutation();

  // Watch save address checkbox
  const saveAddressValue = watch("saveAddress");
  const saveReturnStationValue = watch("saveReturnStation");

  // Fetch user data
  const { data: userData, isLoading } = trpc.getUser.useQuery(user?.id || "", {
    enabled: !!user?.id,
    staleTime: 60_000,
  });

  // Populate form fields when data loads
  useEffect(() => {
    if (userData) {
      // Populate pickup address if saved
      if (userData.street) {
        setValue("street", userData.street);
        setValue("city", userData.city);
        setValue("state", userData.state);
        setValue("zipCode", userData.zipCode);
        setValue("saveAddress", true);
      }

      // Populate return station if saved
      if (userData.returnStationStreet) {
        setValue("returnStationStreet", userData.returnStationStreet);
        setValue("returnStationCity", userData.returnStationCity);
        setValue("returnStationState", userData.returnStationState);
        setValue("returnStationZipCode", userData.returnStationZipCode);
        setValue("saveReturnStation", true);
      }
    }
  }, [userData, setValue]);

  // Handle address saving
  const handleSaveAddressChange = async (checked: boolean) => {
    setValue("saveAddress", checked);

    if (checked && user?.id) {
      try {
        await updateUser.mutateAsync({
          clerkId: user.id,
          street: watch("street"),
          city: watch("city"),
          state: watch("state"),
          zipCode: watch("zipCode"),
          shouldSaveAddress: true,
        });
        console.log("Address saved successfully");
      } catch (error) {
        console.error("Failed to save address:", error);
        setValue("saveAddress", false);
        alert("Failed to save address. Please try again.");
      }
    }
  };

  // Handle return station saving
  const handleSaveReturnStationChange = async (checked: boolean) => {
    setValue("saveReturnStation", checked);

    if (checked && user?.id) {
      try {
        await updateUser.mutateAsync({
          clerkId: user.id,
          returnStationStreet: watch("returnStationStreet"),
          returnStationCity: watch("returnStationCity"),
          returnStationState: watch("returnStationState"),
          returnStationZipCode: watch("returnStationZipCode"),
          shouldSaveReturnStation: true,
        });
        console.log("Return station saved successfully");
      } catch (error) {
        console.error("Failed to save return station:", error);
        setValue("saveReturnStation", false);
        alert("Failed to save return station. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Pickup Address Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pickup Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Existing address fields */}
          {/* Street */}
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              placeholder="123 Main St"
              {...register("street", {
                required: "Street address is required",
              })}
            />
            {errors.street && (
              <p className="text-red-500 text-sm">{errors.street.message}</p>
            )}
          </div>

          {/* City */}
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="New York"
              {...register("city", { required: "City is required" })}
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </div>

          {/* State */}
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              placeholder="NY"
              {...register("state", { required: "State is required" })}
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state.message}</p>
            )}
          </div>

          {/* Zip Code */}
          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              placeholder="12345"
              {...register("zipCode", {
                required: "ZIP code is required",
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: "Invalid ZIP code",
                },
              })}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
            )}
          </div>

          {/* Save Address Checkbox */}
          <div className="col-span-full">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveAddress"
                checked={saveAddressValue}
                onCheckedChange={handleSaveAddressChange}
              />
              <Label
                htmlFor="saveAddress"
                className="text-sm font-normal cursor-pointer"
              >
                {userData?.street
                  ? "Update saved address"
                  : "Save address for future returns"}
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Return Station Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Return Station</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Return Station Street */}
          <div>
            <Label htmlFor="returnStationStreet">Street Address</Label>
            <Input
              id="returnStationStreet"
              {...register("returnStationStreet", {
                required: "Return station street is required",
              })}
            />
            {errors.returnStationStreet && (
              <p className="text-red-500 text-sm">
                {errors.returnStationStreet.message}
              </p>
            )}
          </div>

          {/* Return Station City */}
          <div>
            <Label htmlFor="returnStationCity">City</Label>
            <Input
              id="returnStationCity"
              {...register("returnStationCity", {
                required: "Return station city is required",
              })}
            />
            {errors.returnStationCity && (
              <p className="text-red-500 text-sm">
                {errors.returnStationCity.message}
              </p>
            )}
          </div>

          {/* Return Station State */}
          <div>
            <Label htmlFor="returnStationState">State</Label>
            <Input
              id="returnStationState"
              {...register("returnStationState", {
                required: "Return station state is required",
              })}
            />
            {errors.returnStationState && (
              <p className="text-red-500 text-sm">
                {errors.returnStationState.message}
              </p>
            )}
          </div>

          {/* Return Station ZIP */}
          <div>
            <Label htmlFor="returnStationZipCode">ZIP Code</Label>
            <Input
              id="returnStationZipCode"
              {...register("returnStationZipCode", {
                required: "Return station ZIP code is required",
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
          <div className="col-span-full">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveReturnStation"
                checked={saveReturnStationValue}
                onCheckedChange={handleSaveReturnStationChange}
              />
              <Label
                htmlFor="saveReturnStation"
                className="text-sm font-normal cursor-pointer"
              >
                {userData?.returnStationStreet
                  ? "Update saved return station"
                  : "Save return station for future returns"}
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
