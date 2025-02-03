import { FormData } from "@/utils/returnFormContent";
import {
  CheckCircle,
  User,
  Package,
  MapPin,
  Calendar,
  FileImage,
  QrCode,
} from "lucide-react";

export function Step5Review({ formData }: { formData: FormData }) {
  // Generate preview URLs
  const getPreviewUrl = (file: File | undefined) =>
    file ? URL.createObjectURL(file) : null;

  const qrPreview = getPreviewUrl(formData.qrCode?.[0]);
  const itemPreview = getPreviewUrl(formData.itemImage?.[0]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <div className="text-center">
        <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
          Ready to Submit!
        </h2>
        <p className="text-gray-500 text-lg">
          Please review your details before final submission.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Personal Info Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl transform transition duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Personal Information
            </h3>
          </div>
          <dl className="space-y-3 text-gray-600 text-sm">
            <div>
              <dt className="font-medium">Full Name</dt>
              <dd className="mt-1">{formData.fullName}</dd>
            </div>
            <div>
              <dt className="font-medium">Email</dt>
              <dd className="mt-1">{formData.email}</dd>
            </div>
            <div>
              <dt className="font-medium">Phone</dt>
              <dd className="mt-1">{formData.phone}</dd>
            </div>
          </dl>
        </div>

        {/* Address Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl transform transition duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Address</h3>
          </div>
          <dl className="space-y-3 text-gray-600 text-sm">
            <div>
              <dt className="font-medium">Street</dt>
              <dd className="mt-1">{formData.street}</dd>
            </div>
            <div>
              <dt className="font-medium">City/State/ZIP</dt>
              <dd className="mt-1">
                {formData.city}, {formData.state} {formData.zipCode}
              </dd>
            </div>
          </dl>
        </div>

        {/* Item Details Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl transform transition duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Item Details
            </h3>
          </div>
          <dl className="space-y-3 text-gray-600 text-sm">
            <div>
              <dt className="font-medium">Size</dt>
              <dd className="mt-1 capitalize">{formData.itemSize}</dd>
            </div>
            <div>
              <dt className="font-medium">Notes</dt>
              <dd className="mt-1">
                {formData.additionalNotes || "No additional notes"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Media Preview Card */}
        <div className="md:col-span-2 lg:col-span-1 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl transform transition duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <FileImage className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Media</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* QR Code Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <QrCode className="h-4 w-4" />
                <span>QR Code</span>
              </div>
              {qrPreview ? (
                <img
                  src={qrPreview}
                  alt="QR Code"
                  className="rounded-xl border border-gray-200 aspect-square object-cover"
                />
              ) : (
                <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                  No QR Code
                </div>
              )}
            </div>
            {/* Item Image Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FileImage className="h-4 w-4" />
                <span>Item Image</span>
              </div>
              {itemPreview ? (
                <img
                  src={itemPreview}
                  alt="Item"
                  className="rounded-xl border border-gray-200 aspect-square object-cover"
                />
              ) : (
                <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pickup Info Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl transform transition duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-rose-50 rounded-xl">
              <Calendar className="h-6 w-6 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Pickup Details
            </h3>
          </div>
          <dl className="space-y-3 text-gray-600 text-sm">
            <div>
              <dt className="font-medium">Date</dt>
              <dd className="mt-1">
                {formData.pickupDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) || "Not selected"}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Time Slot</dt>
              <dd className="mt-1 capitalize">{formData.timeSlot}</dd>
            </div>
            <div>
              <dt className="font-medium">Terms Accepted</dt>
              <dd className="mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    formData.termsAccepted
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {formData.termsAccepted ? "Confirmed" : "Pending"}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
