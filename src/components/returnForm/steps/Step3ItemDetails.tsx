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

import { useState } from "react";
import { FileUploadField } from "../FileUploadField";

export function Step3ItemDetails({ register, errors, setValue }: Step3Props) {
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [itemImagePreview, setItemImagePreview] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Item Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="itemSize"
              className="text-sm font-medium text-gray-700"
            >
              Item Size
            </Label>
            <Select
              onValueChange={(value: ItemSize) => setValue("itemSize", value)}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select item size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
            {errors.itemSize && (
              <p className="text-red-500 text-sm mt-2">
                {errors.itemSize.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="additionalNotes"
              className="text-sm font-medium text-gray-700"
            >
              Additional Notes
            </Label>
            <Textarea
              id="additionalNotes"
              placeholder="e.g., Fragile item, special packaging instructions"
              className="mt-2"
              {...register("additionalNotes", {
                required: false,
                // Add validation if needed
                maxLength: {
                  value: 500,
                  message: "Notes cannot exceed 500 characters",
                },
              })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <FileUploadField
            label="Amazon Returns QR Code"
            fieldName="qrCode"
            filePreview={qrCodePreview}
            setFilePreview={setQrCodePreview}
            register={register}
            errors={errors}
            setValue={setValue}
          />

          <FileUploadField
            label="Item Image"
            fieldName="itemImage"
            filePreview={itemImagePreview}
            setFilePreview={setItemImagePreview}
            register={register}
            errors={errors}
            setValue={setValue}
          />
        </div>
      </div>
    </div>
  );
}
