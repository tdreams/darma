import { Progress } from "../ui/progress";
import { ProgressStepsProps } from "./types/formTypes";

export function ProgressSteps({ currentStep, totalSteps }: ProgressStepsProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-4">
      <Progress
        value={progressPercentage}
        className="h-2 bg-gray-200 rounded-lg overflow-hidden"
      />
      <div className="flex justify-between text-sm font-medium text-gray-500">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`text-center ${
              currentStep === index + 1
                ? "text-blue-500 font-semibold"
                : currentStep > index
                ? "text-blue-400"
                : "text-gray-400"
            }`}
          >
            Step {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
