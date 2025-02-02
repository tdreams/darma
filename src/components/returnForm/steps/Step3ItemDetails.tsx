import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ItemSize,
  Step3Props,
  FileUploadFieldProps,
} from "@/utils/returnFormContent";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  fieldName,
  filePreview,
  setFilePreview,
  register,
  errors,
  setValue,
}) => {
  const { handleFileChange, handleDrag, handleDrop, handleClearFile } =
    useFileUpload({ setPreview: setFilePreview, setValue, fieldName });

  return (
    <div className="md:col-span-2">
      <Label htmlFor={fieldName}>{label}</Label>
      <div
        className={`mt-2 p-4 border-2 border-dashed rounded-lg transition-colors ${
          filePreview ? "border-gray-300" : "border-blue-500 bg-blue-50"
        }`}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {filePreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <img
                  src={filePreview}
                  alt={`${fieldName} Preview`}
                  className="max-h-48 rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2"
                  onClick={handleClearFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag & drop your file here, or{" "}
                  <label
                    htmlFor={fieldName}
                    className="text-blue-600 hover:text-blue-500 cursor-pointer"
                  >
                    browse
                  </label>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Input
          id={fieldName}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          {...register(fieldName)}
          onChange={handleFileChange}
        />
      </div>
      {errors[fieldName] && (
        <p className="text-red-500 text-sm mt-1">{errors[fieldName].message}</p>
      )}
    </div>
  );
};

export function Step3ItemDetails({ register, errors, setValue }: Step3Props) {
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [itemImagePreview, setItemImagePreview] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Item Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div>
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            placeholder="Any special instructions"
            {...register("additionalNotes")}
          />
        </div>

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
  );
}
