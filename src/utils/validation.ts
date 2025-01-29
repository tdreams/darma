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
