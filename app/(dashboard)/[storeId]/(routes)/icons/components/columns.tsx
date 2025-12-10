"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { ImageIcon } from "@/components/ui/image-icon"; // Import ImageIcon component


export type IconColumn = {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
};

export const icons: ColumnDef<IconColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "imageUrl",
    header: "Icon",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <ImageIcon imageUrl={row.original.imageUrl} className="h-6 w-6" />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction  data={row.original} />
  }
];
