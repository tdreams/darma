import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { FileUploadFieldProps } from "@/utils/returnFormContent";
import { useFileUpload } from "@/hooks/useFileUpload";

import { Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
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
      <Label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div
        className={`mt-2 p-6 border-2 border-dashed rounded-lg transition-colors ${
          filePreview
            ? "border-gray-300 bg-gray-50"
            : "border-blue-500 bg-blue-50 hover:bg-blue-100"
        }`}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
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
                  className="max-h-48 rounded-lg shadow-sm"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 shadow-md"
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
                className="text-center space-y-2"
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag & drop your file here, or{" "}
                  <label
                    htmlFor={fieldName}
                    className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium"
                  >
                    browse
                  </label>
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: PNG, JPG, JPEG (up to 5MB)
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
        <p className="text-red-500 text-sm mt-2">{errors[fieldName].message}</p>
      )}
    </div>
  );
};
