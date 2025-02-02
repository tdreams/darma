import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  SubmitHandler,
} from "react-hook-form";
import { step3Schema } from "./validation";
import { z } from "zod";

// types/form.ts
export interface FormData {
  // 1. Personal Info
  fullName: string;
  email: string;
  phone: string;

  // 2. Address
  street: string;
  city: string;
  state: string;
  zipCode: string;

  // 3. Item Details
  itemSize: ItemSize;
  additionalNotes?: string;
  qrCode: FileList;
  itemImage: FileList;

  // 4. Pickup Info & Terms
  pickupDate: Date;
  timeSlot: TimeSlot;
  termsAccepted: boolean;
}

export const ITEM_SIZES = ["small", "medium", "large"] as const;
export type ItemSize = (typeof ITEM_SIZES)[number];

export const TIME_SLOTS = ["morning", "afternoon", "evening"] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

// Validation fields by step
export const STEP_VALIDATION_FIELDS = {
  1: ["fullName", "email", "phone"] as const,
  2: ["street", "city", "state", "zipCode"] as const,
  3: ["itemSize", "qrCode", "itemImage"] as const,
  4: ["pickupDate", "timeSlot", "termsAccepted"] as const,
  5: [] as const,
} as const;

// Helper type for step numbers
export type StepNumber = keyof typeof STEP_VALIDATION_FIELDS;

// Helper type for validation fields
export type ValidationFields = (typeof STEP_VALIDATION_FIELDS)[StepNumber];

// Base props that all steps share
interface BaseStepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
}

// Step 3 Props
export interface Step3Props extends BaseStepProps {
  watchQRCode?: FileList;
  watchItemImage?: FileList;
}

// Step 4 Props
export interface Step4Props extends BaseStepProps {
  calendarDate?: Date;
  setCalendarDate: (date: Date | undefined) => void;
}

export interface FileUploadFieldProps {
  label: string;
  fieldName: "qrCode" | "itemImage"; // Limit field names to just file uploads
  filePreview: string | null;
  setFilePreview: (url: string | null) => void;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
}

export interface step3SubProp {
  onSubmit: SubmitHandler<Step3FormData>;
}
export type Step3FormData = z.infer<typeof step3Schema>;
