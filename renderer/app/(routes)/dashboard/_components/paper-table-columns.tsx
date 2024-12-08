"use client"

import { Paper } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
// import { FileActions } from "./file-actions";
import Link from "next/link";
import { BsFiletypePdf, BsMarkdown } from "react-icons/bs"
// import { PaperActions } from "./paper-actions";
import { Folder, PenTool } from "lucide-react";
// import { CategoryActions } from "../../../../../components/category/category-actions";
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
          <div className="flex items-center gap-x-2 hover:cursor-pointer max-w-[300px]">
            {row.original.type === DashboardItemType.Paper && (
              <BsFiletypePdf className="h-4 w-4 text-red-500" />
            )}
            {row.original.type === DashboardItemType.Category && (
              <Folder className="h-4 w-4 text-primary/50 fill-primary/50" />
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