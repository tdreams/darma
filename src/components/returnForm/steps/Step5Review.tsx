import { Step5props } from "@/utils/returnFormContent";
import { CheckCircle, CreditCard, Package, Rocket, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { calculateTotal } from "@/utils/pricing";
import { trpc } from "@/lib/trpc";
import { useUser } from "@clerk/clerk-react";

export function Step5Review({ formData }: Step5props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const [paymentError, setPaymentError] = useState<string | null>(null);

  const createReturn = trpc.createReturn.useMutation();
  const { user } = useUser();

  const totalAmount = calculateTotal(formData.itemSize, formData.expressPickup);
  const basePrice = calculateTotal(formData.itemSize, false);

  //Function to upload files to storage
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const { url } = await response.json();
    return url;
  };
  // Generate preview URLs
  const getPreviewUrl = (file: File | undefined) =>
    file ? URL.createObjectURL(file) : null;

  const qrPreview = getPreviewUrl(formData.qrCode?.[0]);
  const itemPreview = getPreviewUrl(formData.itemImage?.[0]);

  const handlePayment = async () => {
    setLoading(true);
    setPaymentError(null);

    try {
      if (!stripe || !elements || !user) {
        throw new Error("Required dependencies not loaded.");
      }

      // Submit the Payment Element form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // Upload files first
      const [qrCodeUrl, imageUrl] = await Promise.all([
        formData.qrCode?.[0]
          ? uploadFile(formData.qrCode[0])
          : Promise.reject("QR Code required"),
        formData.itemImage?.[0]
          ? uploadFile(formData.itemImage[0])
          : Promise.resolve(null),
      ]);

      // Confirm the payment
      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/success`,
          },
          redirect: "if_required",
        });

      if (confirmError) {
        throw confirmError;
      }

      if (paymentIntent?.status === "succeeded") {
        // Create return record using clerkId
        // Create return record using clerkId
        await createReturn.mutateAsync({
          clerkId: user.id,
          // Item details
          itemSize: formData.itemSize,
          expressPickup: formData.expressPickup,
          qrCodeUrl,
          imageUrl: imageUrl || undefined,
          // Pickup address
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          // Return station address
          returnStationStreet: formData.returnStationStreet,
          returnStationCity: formData.returnStationCity,
          returnStationState: formData.returnStationState,
          returnStationZipCode: formData.returnStationZipCode,
          // Schedule and payment
          pickupDate: formData.pickupDate.toISOString(),
          timeSlot: formData.timeSlot,
          paymentIntentId: paymentIntent.id,
          amount: totalAmount,
        });

        // Redirect to success page
        window.location.href = `${window.location.origin}/success?return_id=${paymentIntent.id}`;
      }
    } catch (err: any) {
      console.error("Payment/upload error:", err);
      setPaymentError(err.message || "Payment failed - please try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800">Review & Payment</h2>
        <p className="text-gray-500 mt-2">
          Verify your details before completing payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Package className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-semibold">Order Summary</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Package Size:</span>
              <span className="font-medium capitalize">
                {formData.itemSize}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Express Pickup:</span>
              <span
                className={
                  formData.expressPickup ? "text-emerald-600" : "text-gray-400"
                }
              >
                {formData.expressPickup ? "Enabled" : "Not enabled"}
              </span>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-gray-800">
                ${(totalAmount / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        {/* Add this before the Payment Summary section */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-6 w-6 text-emerald-500" />
            <h3 className="text-xl font-semibold">Payment Details</h3>
          </div>

          {/* Add the PaymentElement here */}
          <PaymentElement />
        </div>

        {/* Customer Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-purple-500" />
            <h3 className="text-xl font-semibold">Customer Details</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-800">{formData.fullName}</p>
              <p className="text-gray-600">{formData.email}</p>
              <p className="text-gray-600">{formData.phone}</p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="font-medium text-gray-800">Pickup Address</p>
              <p className="text-gray-600">{formData.street}</p>
              <p className="text-gray-600">
                {formData.city}, {formData.state} {formData.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Media Previews */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-amber-500" />
                QR Code
              </h4>
              {qrPreview ? (
                <img
                  src={qrPreview}
                  alt="QR Code"
                  className="rounded-lg border border-gray-200 aspect-square object-cover"
                />
              ) : (
                <div className="aspect-square rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                  No QR Code
                </div>
              )}
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                Item Image
              </h4>
              {itemPreview ? (
                <img
                  src={itemPreview}
                  alt="Item"
                  className="rounded-lg border border-gray-200 aspect-square object-cover"
                />
              ) : (
                <div className="aspect-square rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-6 w-6 text-emerald-500" />
            <h3 className="text-xl font-semibold">Payment Summary</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Price:</span>
              <span className="font-medium">
                ${(basePrice / 100).toFixed(2)}
              </span>
            </div>

            {formData.expressPickup && (
              <div className="flex justify-between">
                <span className="text-gray-600">Express Pickup:</span>
                <span className="font-medium text-emerald-600">+ $3.00</span>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <span className="text-lg font-semibold">Total Due:</span>
              <span className="text-2xl font-bold text-gray-800">
                ${(totalAmount / 100).toFixed(2)}
              </span>
            </div>

            {paymentError && (
              <div className="text-red-500 text-sm mt-2">{paymentError}</div>
            )}

            <Button
              onClick={handlePayment}
              disabled={loading || !stripe}
              className="w-full mt-6 h-12 text-lg"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing Payment...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Pay Securely with Stripe
                </span>
              )}
            </Button>

            <p className="text-sm text-gray-500 text-center mt-4">
              Secure payment processing powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
