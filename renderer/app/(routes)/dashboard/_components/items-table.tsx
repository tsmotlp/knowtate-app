"use client";

import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DefaultTableColumns } from "./default-table-columns";
import Image from "next/image";
import { CategoryType, DashboardItem, DashboardItemType } from "@/types/types";
import { PaperTableColumns } from "./paper-table-columns";

interface ItemsTableProps {
  type: CategoryType,
  items: DashboardItem[],
}

export const ItemsTable = ({
  type,
  items
}: ItemsTableProps) => {
  const columns = type === CategoryType.Papers ? PaperTableColumns : DefaultTableColumns;

  const table = useReactTable({
    columns,
    data: items,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <>
      {items.length > 0 ? (
        <div className="overflow-x-auto size-full border-b">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="w-full">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}
                        className="whitespace-nowrap font-semibold"
                      >
                        {header.isPlaceholder ? null : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length > 0 && (
                table.getRowModel().rows
                  .sort(
                    (a, b) => {
                      // 首先比较url，空字符串视为较小
                      if (a.original.type === DashboardItemType.Category && b.original.type !== DashboardItemType.Category) return -1;
                      if (a.original.type !== DashboardItemType.Category && b.original.type === DashboardItemType.Category) return 1;

                      // 如果url相同（都为空或都不为空），则比较updatedAt
                      return new Date(b.original.lastEdit).getTime() - new Date(a.original.lastEdit).getTime();
                    }
                  )
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center size-full gap-4 pt-60">
          <Image
            src="/men.svg"
            height="300"
            width="300"
            alt="Empty"
            className="dark:hidden"
          />
          <Image
            src="/men-dark.svg"
            height="300"
            width="300"
            alt="Empty"
            className="hidden dark:block"
          />
          <h3 className="text-lg font-semibold">Nothing Found!</h3>
        </div>
      )}
    </>
  )
}