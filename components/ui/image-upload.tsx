"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, ImagePlus } from "lucide-react";
import Image from "next/image";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string[] | string) => void; // parent will merge
  onRemove: (value: string) => void;
  value: string[];
}

interface CloudinaryMultiUploadInfo {
  secure_url?: string;
  files?: {
    uploadInfo?: {
      secure_url?: string;
    };
  }[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const onUpload = (result: CloudinaryUploadWidgetResults) => {
    // helpful debug line while testing — you can remove later
    console.log("CLOUDINARY RESULT:", result);

    const info = result.info as CloudinaryMultiUploadInfo;

    // If Cloudinary returned a files[] array (rare for your widget)
    if (info.files && Array.isArray(info.files)) {
      const urls = info.files
        .map((file) => file.uploadInfo?.secure_url)
        .filter(Boolean) as string[];

      // send the array of new urls to parent — parent will merge
      if (urls.length > 0) onChange(urls);
      return;
    }

    // Most common: single upload per success event — pass single url to parent
    if (info.secure_url) {
      onChange(info.secure_url);
    }
  };

  if (!isMounted) return null;

  return (
    <div>
      {/* Preview uploaded images */}
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                size="icon"
                className="!bg-red-600 hover:!bg-red-700 !text-white"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              sizes="200px"
              className="object-cover"
              alt="Uploaded image"
              src={url}
            />
          </div>
        ))}
      </div>

      {/* Upload button */}
      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset="annett"
        options={{ multiple: true }}
      >
        {({ open }) => (
          <Button
            type="button"
            disabled={disabled}
            className="!bg-blue-100 hover:!bg-blue-200 !text-black"
            onClick={() => open?.()}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload Image(s)
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
