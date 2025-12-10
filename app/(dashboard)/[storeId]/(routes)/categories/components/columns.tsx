"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { IconCell } from "./icon-cell";

export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel: string;
  iconId: string;
  iconImageUrl: string; // Changed from iconValue to iconImageUrl
  createdAt: string;
};


export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboardLabel", // Fixed incorrect key name
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "iconImageUrl",
    header: "Icon",
    cell: ({ row }) => <IconCell iconImageUrl={row.original.iconImageUrl} />,
  },
  
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  }
];
