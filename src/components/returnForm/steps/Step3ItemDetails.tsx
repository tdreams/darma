import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ItemSize, Step3Props } from "@/utils/returnFormContent";

/* ===========================================
   STEP 3: ITEM DETAILS
   =========================================== */
export function Step3ItemDetails({
  register,
  errors,
  setValue,
  watchQRCode,
}: Step3Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Item Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item Size */}
        <div>
          <Label htmlFor="itemSize">Item Size</Label>
          <Select
            onValueChange={(value: ItemSize) => setValue("itemSize", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select item size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
          {errors.itemSize && (
            <p className="text-red-500 text-sm">{errors.itemSize.message}</p>
          )}
        </div>

        {/* Additional Notes (optional) */}
        <div>
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            placeholder="Any special instructions"
            {...register("additionalNotes")}
          />
        </div>

        {/* QR Code Upload */}
        <div className="md:col-span-2">
          <Label htmlFor="qrCode">Amazon Returns QR Code</Label>
          <Input
            id="qrCode"
            type="file"
            accept="image/*"
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                         file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100 mt-1"
            {...register("qrCode", { required: "QR code is required" })}
          />
          {errors.qrCode && (
            <p className="text-red-500 text-sm">{errors.qrCode.message}</p>
          )}
          {watchQRCode && watchQRCode[0] && (
            <p className="text-sm text-gray-500 mt-1">
              File selected: {watchQRCode[0].name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
