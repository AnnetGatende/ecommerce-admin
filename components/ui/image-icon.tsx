"use client";

import React from "react";
import Image from "next/image";

interface ImageIconProps {
  imageUrl: string;
  className?: string;
  alt?: string;
}

export const ImageIcon = React.memo(({ 
  imageUrl, 
  className = "h-6 w-6", 
  alt = "Icon" 
}: ImageIconProps) => {
  if (!imageUrl) {
    return <span className="text-gray-500 text-sm">No Icon</span>;
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 24px, 24px"
      />
    </div>
  );
});

ImageIcon.displayName = "ImageIcon";
