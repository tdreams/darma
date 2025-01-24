export interface FormData {
  // 1. Personal Info
  fullName?: string;
  email?: string;
  phone?: string;

  // 2. Address
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // 3. Item Details
  itemSize?: string;
  additionalNotes?: string;
  qrCode?: FileList; // for file upload

  // 4. Pickup Info & Terms
  pickupDate?: Date;
  timeSlot?: string;
  termsAccepted?: boolean;
}
