import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// Your existing UI components (adjust imports as needed):
import { Button } from "./ui/button";

import { FormData, STEP_VALIDATION_FIELDS } from "@/utils/returnFormContent";
import { Step1PersonalInfo } from "./returnForm/steps/Step1PersonalInfo";
import { Step2Address } from "./returnForm/steps/Step2Address ";
import { Step3ItemDetails } from "./returnForm/steps/Step3ItemDetails";
import { Step4PickupInfo } from "./returnForm/steps/Step4PickupInfo";
import { Step5Review } from "./returnForm/steps/Step5Review";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4Schema } from "@/utils/validation";

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
    resolver: zodResolver(step4Schema),
    defaultValues: {
      itemSize: undefined,
      timeSlot: undefined,
      termsAccepted: false,
    },
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
    // Simulate API call
    console.log("Final form data:", data);
    setFormSubmitted(true);
  };

  /**
   * goNextStep is triggered on "Next" button click. We only validate
   * fields relevant to the current step.
   */

  // Decide which fields to validate for the current step:
  const goNextStep = async () => {
    const fieldsToValidate =
      STEP_VALIDATION_FIELDS[
        currentStep as keyof typeof STEP_VALIDATION_FIELDS
      ];

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
            setValue={setValue}
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
