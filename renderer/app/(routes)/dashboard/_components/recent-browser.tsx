"use client"

import { defaultCategories } from "@/components/default-categories"
import { SearchBar } from "@/components/search-bar"
import { CategoryType, DashboardItem, DashboardItemType } from "@/types/types"
import { Category } from "@prisma/client"
import { useEffect, useState, useMemo } from "react"
import { CategoryCreator } from "./category-creator"
import { PaperUploader } from "./paper-uploader"
import { Separator } from "@/components/ui/separator"
import { NoteCreator } from "./note-creator"
import { RecentItem } from "./recent-item"

interface RecentBrowserProps {
  category: Category | undefined | null,
  parentId: string,
  initItems: DashboardItem[]
}

const getDateRanges = () => {
  const now = new Date();
  const getStartOf = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  return {
    startOfToday: getStartOf(0),
    startOfYesterday: getStartOf(1),
    startOfLastWeek: getStartOf(7),
    startOfLastMonth: getStartOf(30)
  };
};

// 这里的item包含Category, Paper和Note
export const RecentBrowser = ({
  category,
  parentId,
  initItems,
}: RecentBrowserProps) => {
  if (!category) {
    category = defaultCategories.find((c) => c.id === parentId)
  }
  const [query, setQuery] = useState("");
  const [originalItems, setOriginalItems] = useState<DashboardItem[]>(initItems);
  const [filteredItems, setFilteredItems] = useState<DashboardItem[]>(initItems);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const onExpand = (id: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [id]: !prevExpanded[id]
    }));
  };

  const { startOfToday, startOfYesterday, startOfLastWeek, startOfLastMonth } = getDateRanges();

  const filteredGroups = useMemo(() => ({
    today: filteredItems.filter(item => item.lastEdit >= startOfToday),
    yesterday: filteredItems.filter(item => item.lastEdit >= startOfYesterday && item.lastEdit < startOfToday),
    week: filteredItems.filter(item => item.lastEdit >= startOfLastWeek && item.lastEdit < startOfYesterday),
    month: filteredItems.filter(item => item.lastEdit >= startOfLastMonth && item.lastEdit < startOfLastWeek)
  }), [filteredItems, startOfToday, startOfYesterday, startOfLastWeek, startOfLastMonth]);

  useEffect(() => {
    if (!query) {
      setFilteredItems(originalItems);
      return;
    }
    const filterByQuery = (item: DashboardItem) =>
      item.label.toLowerCase().includes(query.toLowerCase());
    setFilteredItems(originalItems.filter(filterByQuery));
  }, [query, originalItems]);

  return (
    <>
      {category ? (
        <div className="p-4 h-full w-full">
          <div className="w-full flex items-center justify-between">
            <div className="h-full w-full flex items-center justify-start gap-x-16">
              <div className="h-full font-semibold">
                {category.name}
              </div>
              {category.type === CategoryType.Papers && (
                <div className="h-full flex items-center gap-x-2">
                  <PaperUploader categoryId={parentId} setItems={setOriginalItems} />
                  <CategoryCreator type={CategoryType.Papers} parentId={parentId} setItems={setOriginalItems} />
                </div>
              )}
              {category.type === CategoryType.Markdowns && (
                <div className="h-full flex items-center gap-x-2">
                  <NoteCreator type={DashboardItemType.Markdown} categoryId={parentId} setItems={setOriginalItems} />
                  <CategoryCreator type={CategoryType.Markdowns} parentId={parentId} setItems={setOriginalItems} />
                </div>
              )}
              {category.type === CategoryType.Whiteboards && (
                <div className="h-full flex items-center gap-x-2">
                  <NoteCreator type={DashboardItemType.Whiteboard} categoryId={parentId} setItems={setOriginalItems} />
                  <CategoryCreator type={CategoryType.Whiteboards} parentId={parentId} setItems={setOriginalItems} />
                </div>
              )}
            </div>
            <div className="h-full">
              <SearchBar
                query={query}
                setQuery={setQuery}
              />
            </div>
          </div>
          <Separator className="my-4" />
          <div className="w-full flex flex-col items-center gap-y-4">
            <RecentItem
              label="今天"
              expanded={expanded["today"]}
              onExpand={() => onExpand("today")}
              items={filteredGroups.today}
            />
            <RecentItem
              label="昨天"
              expanded={expanded["yesterday"]}
              onExpand={() => onExpand("yesterday")}
              items={filteredGroups.yesterday}
            />
            <RecentItem
              label="过去一周"
              expanded={expanded["week"]}
              onExpand={() => onExpand("week")}
              items={filteredGroups.week}
            />
            <RecentItem
              label="本月更早"
              expanded={expanded["month"]}
              onExpand={() => onExpand("month")}
              items={filteredGroups.month}
            />
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          出错啦
        </div>
      )}
    </>
  )
}