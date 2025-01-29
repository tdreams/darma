import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ===========================================
   STEP 2: ADDRESS
   =========================================== */
export function Step2Address({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Address</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Street */}
        <div>
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            placeholder="123 Main St"
            {...register("street", { required: "Street address is required" })}
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
      </div>
    </div>
  );
}
