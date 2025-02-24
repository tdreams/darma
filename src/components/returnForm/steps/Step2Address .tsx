// components/returnForm/steps/Step2Address.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@clerk/clerk-react";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { MapPin, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  isZipCodeSupported,
  getCityFromZipCode,
  getServiceAreaMessage,
} from "@/utils/locationValidation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface LocationStatus {
  isSupported: boolean;
  message: string;
  city?: string;
}

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
  const [_isValidatingZip, setIsValidatingZip] = useState(false);
  const [pickupLocationStatus, setPickupLocationStatus] =
    useState<LocationStatus | null>(null);
  const [returnStationLocationStatus, setReturnStationLocationStatus] =
    useState<LocationStatus | null>(null);

  // Watch save address checkbox
  const saveAddressValue = watch("saveAddress");
  const saveReturnStationValue = watch("saveReturnStation");
  const zipCode = watch("zipCode");
  const returnStationZipCode = watch("returnStationZipCode");

  // Fetch user data
  const { data: userData, isLoading } = trpc.getUser.useQuery(user?.id || "", {
    enabled: !!user?.id,
    staleTime: 60_000,
  });

  // Validate ZIP code
  const validateZipCode = async (
    zipCode: string,
    isReturnStation: boolean = false
  ) => {
    setIsValidatingZip(true);

    if (/^\d{5}$/.test(zipCode)) {
      const supported = isZipCodeSupported(zipCode);
      const city = getCityFromZipCode(zipCode);

      const status = {
        isSupported: supported,
        message: supported
          ? `Great! We service ${city}.`
          : getServiceAreaMessage(),
        city: city,
      };

      if (isReturnStation) {
        setReturnStationLocationStatus(status);
        if (!supported) {
          toast.error(
            `Return station ZIP code ${zipCode} is not in our service area`
          );
        }
      } else {
        setPickupLocationStatus(status);
        if (!supported) {
          toast.error(`Pickup ZIP code ${zipCode} is not in our service area`);
        }
      }
    } else {
      if (isReturnStation) {
        setReturnStationLocationStatus(null);
      } else {
        setPickupLocationStatus(null);
      }
    }

    setIsValidatingZip(false);
    return true;
  };

  // Watch ZIP code changes
  useEffect(() => {
    if (zipCode) {
      validateZipCode(zipCode, false);
    } else {
      setPickupLocationStatus(null);
    }
  }, [zipCode]);

  useEffect(() => {
    if (returnStationZipCode) {
      validateZipCode(returnStationZipCode, true);
    } else {
      setReturnStationLocationStatus(null);
    }
  }, [returnStationZipCode]);

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
        const currentZipCode = watch("zipCode");
        if (!isZipCodeSupported(currentZipCode)) {
          toast.error("Cannot save address with unsupported ZIP code");
          setValue("saveAddress", false);
          return;
        }

        await updateUser.mutateAsync({
          clerkId: user.id,
          street: watch("street"),
          city: watch("city"),
          state: watch("state"),
          zipCode: currentZipCode,
          shouldSaveAddress: true,
        });
        toast.success("Address saved successfully");
      } catch (error) {
        console.error("Failed to save address:", error);
        setValue("saveAddress", false);
        toast.error("Failed to save address. Please try again.");
      }
    }
  };

  // Handle return station saving
  const handleSaveReturnStationChange = async (checked: boolean) => {
    setValue("saveReturnStation", checked);

    if (checked && user?.id) {
      try {
        const currentReturnZipCode = watch("returnStationZipCode");
        if (!isZipCodeSupported(currentReturnZipCode)) {
          toast.error("Cannot save return station with unsupported ZIP code");
          setValue("saveReturnStation", false);
          return;
        }

        await updateUser.mutateAsync({
          clerkId: user.id,
          returnStationStreet: watch("returnStationStreet"),
          returnStationCity: watch("returnStationCity"),
          returnStationState: watch("returnStationState"),
          returnStationZipCode: currentReturnZipCode,
          shouldSaveReturnStation: true,
        });
        toast.success("Return station saved successfully");
      } catch (error) {
        console.error("Failed to save return station:", error);
        setValue("saveReturnStation", false);
        toast.error("Failed to save return station. Please try again.");
      }
    }
  };

  const renderZipCodeInput = (
    fieldName: string,
    label: string,
    status: LocationStatus | null,
    _isReturnStation: boolean = false
  ) => (
    <div className="relative">
      <Label htmlFor={fieldName}>{label}</Label>
      <Input
        id={fieldName}
        placeholder="12345"
        {...register(fieldName, {
          required: `${label} is required`,
          pattern: {
            value: /^\d{5}$/,
            message: "Please enter a valid 5-digit ZIP code",
          },
          validate: (value: string) =>
            isZipCodeSupported(value) ||
            "Sorry, this ZIP code is not in our service area",
        })}
        className={status?.isSupported ? "border-green-500" : ""}
      />
      {status && (
        <div
          className={`mt-2 text-sm flex items-center gap-2 ${
            status.isSupported ? "text-green-600" : "text-red-600"
          }`}
        >
          {status.isSupported ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          {status.message}
        </div>
      )}
      {errors[fieldName] && (
        <p className="text-red-500 text-sm mt-1">{errors[fieldName].message}</p>
      )}
    </div>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertTitle>Service Area Information</AlertTitle>
        <AlertDescription>{getServiceAreaMessage()}</AlertDescription>
      </Alert>

      {/* Pickup Address Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pickup Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* ZIP Code with validation */}
          {renderZipCodeInput(
            "zipCode",
            "ZIP Code",
            pickupLocationStatus,
            false
          )}

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

          {/* Return Station ZIP with validation */}
          {renderZipCodeInput(
            "returnStationZipCode",
            "Return Station ZIP Code",
            returnStationLocationStatus,
            true
          )}

          {/* Save Return Station Checkbox */}
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
