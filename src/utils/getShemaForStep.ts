import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from "./validation";

// Helper function to get the schema for the current step
export const getSchemaForStep = (step: number) => {
  switch (step) {
    case 1:
      return step1Schema;
    case 2:
      return step2Schema;
    case 3:
      return step3Schema;
    case 4:
      return step4Schema;
    default:
      return step4Schema; // Default to the last step's schema
  }
};
