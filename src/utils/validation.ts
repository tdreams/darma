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
  savePhone: z.boolean().optional(),
});

export const step2Schema = z.object({
  // Pickup address
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z
    .string()
    .min(1, "Zip code is required")
    .regex(/^\d{5}$/, "Zip code must be 5 digits"),
  saveAddress: z.boolean().optional(),

  // Return station
  returnStationStreet: z.string().min(1, "Return station street is required"),
  returnStationCity: z.string().min(1, "Return station city is required"),
  returnStationState: z.string().min(1, "Return station state is required"),
  returnStationZipCode: z
    .string()
    .min(1, "Return station zip code is required")
    .regex(/^\d{5}$/, "Return station zip code must be 5 digits"),
  saveReturnStation: z.boolean().optional(),
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

  expressPickup: z.boolean().default(false),
});

export const fullFormSchema = z.object({
  // Step 1: Personal Information
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z.string().min(1, "Phone number is required"),
  savePhone: z.boolean().optional(),

  // Step 2: Addresses
  // Pickup address
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z
    .string()
    .min(1, "Zip code is required")
    .regex(/^\d{5}$/, "Zip code must be 5 digits"),
  saveAddress: z.boolean().optional(),

  // Return station
  returnStationStreet: z.string().min(1, "Return station street is required"),
  returnStationCity: z.string().min(1, "Return station city is required"),
  returnStationState: z.string().min(1, "Return station state is required"),
  returnStationZipCode: z
    .string()
    .min(1, "Return station zip code is required")
    .regex(/^\d{5}$/, "Return station zip code must be 5 digits"),
  saveReturnStation: z.boolean().optional(),

  // Step 3: Item Details
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

  // Step 4: Schedule and Options
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
  expressPickup: z.boolean().default(false),
});

// Export types
export type Step1Input = z.infer<typeof step1Schema>;
export type Step2Input = z.infer<typeof step2Schema>;
export type Step3Input = z.infer<typeof step3Schema>;
export type Step4Input = z.infer<typeof step4Schema>;
export type FullFormInput = z.infer<typeof fullFormSchema>;
