"use client"

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { BsFiletypePdf } from "react-icons/bs"
import { Folder } from "lucide-react";
import { DashboardItem, DashboardItemType } from "@/types/types";
import { ItemActions } from "./item-actions";

export const PaperTableColumns: ColumnDef<DashboardItem>[] = [
  {
    header: "标题",
    size: 300,
    cell: ({ row }) => {
      return (
        <Link
          href={row.original.type === DashboardItemType.Category ?
            `/dashboard/${row.original.id}` : `/papers/${row.original.id}`}
          legacyBehavior
        >
          <div className="flex items-center gap-x-2 max-w-[300px] hover:cursor-pointer">
            {row.original.type === DashboardItemType.Paper && (
              <BsFiletypePdf className="text-red-500 size-4" />
            )}
            {row.original.type === DashboardItemType.Category && (
              <Folder className="text-primary size-4" />
            )}
            <span className="truncate text-muted-foreground">{row.original.label}</span>
          </div>
        </Link>
      )
    }
  },
  {
    header: "作者",
    size: 200,
    cell: ({ row }) => {
      return (
        <div className="truncate text-muted-foreground hover:cursor-pointer max-w-[200px]">
          {row.original.authors}
        </div>
      )
    }
  },
  {
    header: "期刊",
    size: 200,
    cell: ({ row }) => {
      return (
        <div className="truncate text-muted-foreground hover:cursor-pointer max-w-[200px]">
          {row.original.publication}
        </div>
      )
    }
  },
  // {
  //   header: "发表时间",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="truncate text-muted-foreground hover:cursor-pointer">
  //         {row.original.publicationDate}
  //       </div>
  //     )
  //   }
  // },
  {
    header: "最后修改",
    cell: ({ row }) => {
      return (
        <div className="truncate text-muted-foreground hover:cursor-pointer">
          {format(new Date(row.original.lastEdit), "yyyy/MM/dd")}
        </div>
      );
    },
  },
  {
    header: "管理",
    cell: ({ row }) => {
      return (
        <div className="truncate text-muted-foreground hover:cursor-pointer">
          <ItemActions
            item={row.original}
          />
        </div>
      );
    },
  },
]