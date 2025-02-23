import { useState, useEffect, Suspense } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { Button } from "./ui/button";
import {
  ReturnFormData,
  STEP_VALIDATION_FIELDS,
} from "@/utils/returnFormContent";
import { Step1PersonalInfo } from "./returnForm/steps/Step1PersonalInfo";

import { Step3ItemDetails } from "./returnForm/steps/Step3ItemDetails";
import { Step4PickupInfo } from "./returnForm/steps/Step4PickupInfo";
import { Step5Review } from "./returnForm/steps/Step5Review";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSchemaForStep } from "@/utils/getShemaForStep";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Step2Address } from "./returnForm/steps/Step2Address ";

import { useUser } from "@clerk/clerk-react";
import { trpc } from "@/lib/trpc";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function MultiStepReturnForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>();

  const { user } = useUser();
  const updateUser = trpc.updateUser.useMutation();

  // Initialize React Hook Form methods
  const methods = useForm<ReturnFormData>({
    mode: "onBlur",
    resolver: zodResolver(getSchemaForStep(currentStep)),
    defaultValues: {
      itemSize: undefined,
      timeSlot: undefined,
      termsAccepted: false,
      expressPickup: false,
      savePhone: false, // Default to not saving phone
    },
  });

  // Destructure the methods for convenience
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  // Watch values for calculations and previews
  const watchQRCode = watch("qrCode");
  const watchItemImage = watch("itemImage");

  // For date selection
  const [calendarDate, setCalendarDate] = useState<Date | undefined>();

  // Create PaymentIntent when reaching step 5
  useEffect(() => {
    if (currentStep === 5) {
      const createPaymentIntent = async () => {
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/api/create-payment-intent",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                itemSize: getValues("itemSize"),
                expressPickup: getValues("expressPickup"),
              }),
            }
          );

          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (err) {
          console.error("Error creating payment intent:", err);
        }
      };

      createPaymentIntent();
    }
  }, [currentStep, getValues]);

  const onSubmit: SubmitHandler<ReturnFormData> = async (data) => {
    try {
      // Update user data if phone saving is enabled
      if (data.savePhone && user?.id) {
        console.log("Updating user with phone:", data.phone); // Debug log
        await updateUser.mutateAsync({
          clerkId: user.id,
          phone: data.phone,
          shouldSavePhone: true, // Explicitly set to true
        });
      }

      // Handle the rest of the form submission
      console.log("Final form data:", data);
      setFormSubmitted(true);
    } catch (error) {
      console.error("Form submission error:", error);
      // Show error to user
      alert("Failed to save your information. Please try again.");
    }
  };

  const goNextStep = async () => {
    const fieldsToValidate = [
      ...STEP_VALIDATION_FIELDS[
        currentStep as keyof typeof STEP_VALIDATION_FIELDS
      ],
      ...(currentStep === 1 && getValues("savePhone") ? ["phone"] : []),
    ] as (keyof ReturnFormData)[];

    const valid = await trigger(fieldsToValidate);
    if (!valid) return;

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const goPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Success screen
  if (formSubmitted) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p className="text-gray-700 mb-4">
          Your return request has been submitted. We'll send a confirmation
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

      {/* Wrap the form with FormProvider and Suspense */}
      <FormProvider {...methods}>
        <Suspense fallback={<div>Loading form step...</div>}>
          <form onSubmit={(e) => e.preventDefault()}>
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
                setValue={setValue}
                watchItemImage={watchItemImage}
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

            {currentStep === 5 && clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: { theme: "stripe" },
                }}
              >
                <Step5Review formData={getValues()} />
              </Elements>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <Button variant="outline" onClick={goPrevStep}>
                  Back
                </Button>
              )}
              {currentStep < 5 && (
                <Button type="button" onClick={goNextStep}>
                  Next
                </Button>
              )}
            </div>
          </form>
        </Suspense>
      </FormProvider>
    </div>
  );
}
