import { useRef } from "react";

type UseFileUploadProps = {
  setPreview: (url: string | null) => void;
  setValue: (field: "qrCode" | "itemImage", files: FileList) => void; // Update this line
  fieldName: "qrCode" | "itemImage"; // Update this line
};

export function useFileUpload({
  setPreview,
  setValue,
  fieldName,
}: UseFileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    processFile(file);
  };

  const processFile = (file?: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, JPEG)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreview(url);

    // Update form value
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    setValue(fieldName, dataTransfer.files);
  };

  const handleClearFile = () => {
    setPreview(null);
    const dataTransfer = new DataTransfer();
    setValue(fieldName, dataTransfer.files);
  };

  return {
    inputRef,
    handleFileChange,
    handleDrag,
    handleDrop,
    handleClearFile,
  };
}
