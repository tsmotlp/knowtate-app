"use client"

import React from "react";
import { DashboardItem } from "@/types/types";
import { format } from "date-fns";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BsFiletypePdf } from "react-icons/bs";

interface RecentItemProps {
  label: string,
  expanded?: boolean
  onExpand: () => void
  items: DashboardItem[]
}

export const RecentItem = ({
  label,
  expanded = true,
  onExpand,
  items
}: RecentItemProps) => {

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;


  return (
    <div className="size-full">
      <div className="group min-h-[27px] w-full py-1 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5 flex items-center">
        <div
          role="button"
          className="mx-1 h-full rounded-sm"
          onClick={handleExpand}
        >
          <ChevronIcon
            className="size-4 shrink-0 text-muted-foreground/50"
          />
        </div>
        <span className="truncate">
          {label}
        </span>
      </div>
      {expanded && (
        <div className="px-6 py-4">
          {items && items.map((item) => (
            <div
              key={item.id}
              className="flex w-full justify-between text-sm"
            >
              <Link
                href={`/papers/${item.id}`}
                className="flex items-center hover:underline"
              >
                <BsFiletypePdf className="size-4 mr-2 text-red-500" />
                <span className="text-muted-foreground">{item.label}</span>
              </Link>
              <div className="text-muted-foreground">
                {format(new Date(item.lastEdit), "MM/dd HH:mm")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}