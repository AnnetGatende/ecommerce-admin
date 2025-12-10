"use client";

import React from "react";
import { ImageIcon } from "@/components/ui/image-icon";

interface IconCellProps {
  iconImageUrl: string;
}

export const IconCell: React.FC<IconCellProps> = ({ iconImageUrl }) => {
  return (
    <div className="flex items-center gap-x-2">
      <ImageIcon imageUrl={iconImageUrl} className="h-6 w-6" />
    </div>
  );
};
