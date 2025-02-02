// utils/validation.ts
import { z } from "zod";
import { TIME_SLOTS } from "@/utils/returnFormContent";

export const step4Schema = z.object({
  pickupDate: z
    .date({
      required_error: "Please select a pickup date",
      invalid_type_error: "That's not a valid date",
    })
    .min(new Date(), "Pickup date must be in the future"),

  timeSlot: z.enum(TIME_SLOTS, {
    required_error: "Please select a time slot",
    invalid_type_error: "Please select a valid time slot",
  }),

  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

// utils/validation.ts
export const step3Schema = z.object({
  itemSize: z.enum(["small", "medium", "large"], {
    required_error: "Please select an item size",
  }),
  additionalNotes: z.string().optional(),
  qrCode: z
    .any()
    .refine((files) => files?.[0], "QR code is required")
    .refine(
      (files) => files?.[0]?.type.startsWith("image/"),
      "Please upload an image file"
    )
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024,
      "File size should be less than 5MB"
    ),
});
