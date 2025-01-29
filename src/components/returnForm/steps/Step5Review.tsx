import { FormData } from "@/utils/returnFormContent";

/* ===========================================
   STEP 5: PERSONAL INFO Review
   =========================================== */
export function Step5Review({ formData }: { formData: FormData }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Review Your Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold mb-2">Personal Information</h3>
          <p>Name: {formData.fullName}</p>
          <p>Email: {formData.email}</p>
          <p>Phone: {formData.phone}</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Address</h3>
          <p>{formData.street}</p>
          <p>
            {formData.city}, {formData.state} {formData.zipCode}
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Item Details</h3>
          <p>Item Size: {formData.itemSize}</p>
          <p>Additional Notes: {formData.additionalNotes || "None"}</p>
          <p>QR Code: {formData.qrCode?.[0]?.name || "Not uploaded"}</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Pickup Info</h3>
          <p>
            Date:{" "}
            {formData.pickupDate
              ? formData.pickupDate.toLocaleDateString()
              : "Not selected"}
          </p>
          <p>Time Slot: {formData.timeSlot}</p>
          <p>Terms Accepted: {formData.termsAccepted ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
}
