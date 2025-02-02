// utils/validation.ts
import { z } from "zod";
import { TIME_SLOTS } from "@/utils/returnFormContent";

export const step1Schema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(50, "Full name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
});

export const step2Schema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z
    .string()
    .min(1, "Zip code is required")
    .regex(/^\d{5}$/, "Zip code must be 5 digits"),
});

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
  itemImage: z
    .any()
    .refine((files) => files?.[0], "Item image is required")
    .refine(
      (files) => files?.[0]?.type.startsWith("image/"),
      "Please upload an image file"
    )
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024,
      "File size should be less than 5MB"
    ),
});

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

export const fullFormSchema = z.object({
  // Step 1
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z.string().min(1, "Phone number is required"),

  // Step 2
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),

  // Step 3
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
  itemImage: z
    .any()
    .refine((files) => files?.[0], "Item image is required")
    .refine(
      (files) => files?.[0]?.type.startsWith("image/"),
      "Please upload an image file"
    )
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024,
      "File size should be less than 5MB"
    ),

  // Step 4
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
