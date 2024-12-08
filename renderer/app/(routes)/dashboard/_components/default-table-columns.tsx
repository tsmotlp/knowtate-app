"use client"

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { BsFiletypePdf, BsMarkdown } from "react-icons/bs"
import { Folder, PenTool } from "lucide-react";
import { DashboardItem, DashboardItemType } from "@/types/types";
import { ItemActions } from "./item-actions";

export const DefaultTableColumns: ColumnDef<DashboardItem>[] = [
  {
    header: "标题",
    cell: ({ row }) => {
      return (
        <Link
          href={row.original.type === DashboardItemType.Category ?
            `/dashboard/${row.original.id}` : `/notes/${row.original.id}`}
          legacyBehavior
        >
          <div className="hover:cursor-pointer flex items-center gap-x-2">
            {row.original.type === DashboardItemType.Paper && (
              <BsFiletypePdf className="size-4 text-red-500" />
            )}
            {row.original.type === DashboardItemType.Category && (
              <Folder className="size-4 text-primary fill-primary opacity-50" />
            )}
            {row.original.type === DashboardItemType.Markdown && (
              <BsMarkdown className="size-4 text-primary fill-primary opacity-50" />
            )}
            {row.original.type === DashboardItemType.Whiteboard && (
              <PenTool className="size-4 text-purple-300" />
            )}
            <span className="truncate text-muted-foreground">{row.original.label}</span>
          </div>
        </Link>
      )
    }
  },
  {
    header: "所属论文",
    cell: ({ row }) => {
      return (
        <>
          {row.original.paperId && (
            <Link
              href={`/papers/${row.original.paperId}`}
              className="size-full flex items-center gap-x-1 text-muted-foreground hover:underline"
            >
              <BsFiletypePdf className="size-4 text-red-500 fill-red-500" />
              <span className="truncate">{row.original.paperTile}</span>
            </Link>
          )}
        </>
      )
    }
  },
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