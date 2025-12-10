"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface IconUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string;
}

const IconUpload: React.FC<IconUploadProps> = ({
  disabled,
  onChange,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSuccess = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      {value && (
        <div className="relative w-16 h-16 rounded-md overflow-hidden border">
          <div className="z-10 absolute top-1 right-1">
            <Button
              type="button"
              onClick={() => onChange("")}
              variant="destructive"
              size="icon"
              className="h-6 w-6"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
          <Image
            fill
            className="object-cover"
            alt="Icon"
            src={value}
          />
        </div>
      )}

      <CldUploadWidget
        onSuccess={onSuccess}
        uploadPreset={
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "annett"
        }
        options={{
          // Cloud name must be configured in env; no sensible fallback.
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        }}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
              className="w-full"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              {value ? "Change Icon" : "Upload Icon"}
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default IconUpload;
