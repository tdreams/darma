import React, { useState } from "react";
import { useForm, SubmitHandler, UseFormSetValue } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

// Your existing UI components (adjust imports as needed):
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { FormData } from "@/utils/returnFormContent";

export default function MultiStepReturnForm() {
  /**
   * currentStep -> which step the user is on (1 to 4).
   * formSubmitted -> if true, show success message (rather than steps).
   */
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onBlur", // Validate on blur (or change as you prefer)
  });

  // For file upload preview
  const watchQRCode = watch("qrCode");

  // For date selection
  const [calendarDate, setCalendarDate] = useState<Date | undefined>();

  /**
   * onSubmit is called ONLY when the user clicks "Submit" on the final step
   * and all validations pass.
   */
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Final form data:", data);
    setFormSubmitted(true);
  };

  /**
   * goNextStep is triggered on "Next" button click. We only validate
   * fields relevant to the current step.
   */
  const goNextStep = async () => {
    // Decide which fields to validate for the current step:
    let fieldsToValidate: (keyof FormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["fullName", "email", "phone"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["street", "city", "state", "zipCode"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["itemSize", "qrCode"];
      // additionalNotes is optional
    } else if (currentStep === 4) {
      fieldsToValidate = ["pickupDate", "timeSlot", "termsAccepted"];
    }

    const valid = await trigger(fieldsToValidate);

    if (!valid) {
      // If validation fails, do not proceed
      return;
    }
    // If validation succeeds, go to next step or submit if it's the last step
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // If at final step, call handleSubmit to submit the entire form
      handleSubmit(onSubmit)();
    }
  };

  /**
   * goPrevStep -> handle "Back" button
   */
  const goPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // If the user has submitted the form, show a success screen
  if (formSubmitted) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p className="text-gray-700 mb-4">
          Your return request has been submitted. We’ll send a confirmation
          email shortly.
        </p>
        <Button onClick={() => setFormSubmitted(false)}>Fill Again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Schedule a Return</h1>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`flex-1 text-center border-b-4 ${
              currentStep >= step
                ? "border-blue-500 text-blue-500"
                : "border-gray-200 text-gray-400"
            } pb-2 text-sm font-semibold`}
          >
            Step {step}
          </div>
        ))}
      </div>

      {/* Render different "pages" based on currentStep */}
      <form onSubmit={(e) => e.preventDefault()} /* prevent default submit */>
        {currentStep === 1 && (
          <Step1PersonalInfo register={register} errors={errors} />
        )}

        {currentStep === 2 && (
          <Step2Address register={register} errors={errors} />
        )}

        {currentStep === 3 && (
          <Step3ItemDetails
            register={register}
            errors={errors}
            watchQRCode={watchQRCode}
          />
        )}

        {currentStep === 4 && (
          <Step4PickupInfo
            register={register}
            errors={errors}
            setValue={setValue}
            calendarDate={calendarDate}
            setCalendarDate={setCalendarDate}
          />
        )}

        {currentStep === 5 && <Step5Review formData={getValues()} />}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <Button variant="outline" onClick={goPrevStep}>
              Back
            </Button>
          )}
          <Button type="button" onClick={goNextStep}>
            {currentStep < 4 ? "Next" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ===========================================
   STEP 1: PERSONAL INFO
   =========================================== */
function Step1PersonalInfo({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
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

        {/* Phone */}
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

/* ===========================================
   STEP 2: ADDRESS
   =========================================== */
function Step2Address({ register, errors }: { register: any; errors: any }) {
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

/* ===========================================
   STEP 3: ITEM DETAILS
   =========================================== */
function Step3ItemDetails({
  register,
  errors,
  watchQRCode,
}: {
  register: any;
  errors: any;
  watchQRCode: FileList | undefined;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Item Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item Size */}
        <div>
          <Label htmlFor="itemSize">Item Size</Label>
          <Select
            onValueChange={(value) => register("itemSize").onChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select item size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
          {errors.itemSize && (
            <p className="text-red-500 text-sm">{errors.itemSize.message}</p>
          )}
        </div>

        {/* Additional Notes (optional) */}
        <div>
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            placeholder="Any special instructions"
            {...register("additionalNotes")}
          />
        </div>

        {/* QR Code Upload */}
        <div className="md:col-span-2">
          <Label htmlFor="qrCode">Amazon Returns QR Code</Label>
          <Input
            id="qrCode"
            type="file"
            accept="image/*"
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                       file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 mt-1"
            {...register("qrCode", { required: "QR code is required" })}
          />
          {errors.qrCode && (
            <p className="text-red-500 text-sm">{errors.qrCode.message}</p>
          )}
          {watchQRCode && watchQRCode[0] && (
            <p className="text-sm text-gray-500 mt-1">
              File selected: {watchQRCode[0].name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===========================================
   STEP 4: PICKUP INFO & TERMS
   =========================================== */
function Step4PickupInfo({
  register,
  errors,
  setValue,
  calendarDate,
  setCalendarDate,
}: {
  register: any;
  errors: any;
  setValue: UseFormSetValue<FormData>;
  calendarDate: Date | undefined;
  setCalendarDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pickup Info & Terms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pickup Date */}
        <div>
          <Label>Preferred Pickup Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal mt-1 ${
                  !calendarDate && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {calendarDate ? format(calendarDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={(selectedDate) => {
                  setCalendarDate(selectedDate || undefined);
                  setValue("pickupDate", selectedDate);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.pickupDate && (
            <p className="text-red-500 text-sm">{errors.pickupDate.message}</p>
          )}
        </div>

        {/* Time Slot */}
        <div>
          <Label htmlFor="timeSlot">Time Slot</Label>
          <Select onValueChange={(val) => setValue("timeSlot", val)}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a time slot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12PM - 3PM)</SelectItem>
              <SelectItem value="evening">Evening (3PM - 6PM)</SelectItem>
            </SelectContent>
          </Select>
          {errors.timeSlot && (
            <p className="text-red-500 text-sm">{errors.timeSlot.message}</p>
          )}
        </div>
      </div>

      {/* Terms */}
      <div className="mt-6">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            {...register("termsAccepted", {
              required: "You must accept the terms and conditions",
            })}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            I agree to the <span className="underline">terms of service</span>{" "}
            and
            <span className="underline"> privacy policy</span>.
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-red-500 text-sm mt-1">
            {errors.termsAccepted.message}
          </p>
        )}
      </div>
    </div>
  );
}
/* ===========================================
   STEP 5: PERSONAL INFO Review
   =========================================== */
function Step5Review({ formData }: { formData: FormData }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Review Your Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold mb-2">Personal Information</h3>
          <p>Name: {formData.fullName}</p>
          <p>Email: {formData.email}</p>
          <p>Phone: {formData.phone}</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Address</h3>
          <p>{formData.street}</p>
          <p>
            {formData.city}, {formData.state} {formData.zipCode}
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Item Details</h3>
          <p>Item Size: {formData.itemSize}</p>
          <p>Additional Notes: {formData.additionalNotes || "None"}</p>
          <p>QR Code: {formData.qrCode?.[0]?.name || "Not uploaded"}</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Pickup Info</h3>
          <p>
            Date:{" "}
            {formData.pickupDate
              ? formData.pickupDate.toLocaleDateString()
              : "Not selected"}
          </p>
          <p>Time Slot: {formData.timeSlot}</p>
          <p>Terms Accepted: {formData.termsAccepted ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
}
