"use client"

import { defaultCategories } from "@/components/default-categories"
import { SearchBar } from "@/components/search-bar"
import { CategoryType, DashboardItem, DashboardItemType } from "@/types/types"
import { Category } from "@prisma/client"
import { useEffect, useState } from "react"
import { CategoryCreator } from "./category-creator"
import { PaperUploader } from "./paper-uploader"
import { Separator } from "@/components/ui/separator"
import { NoteCreator } from "./note-creator"
import { ItemsTable } from "./items-table"

interface ItemsBrowserProps {
  category: Category | undefined | null,
  parentId: string,
  initItems: DashboardItem[]
}

interface CategoryActionsProps {
  type: CategoryType;
  parentId: string;
  setItems: (items: DashboardItem[]) => void;
}

const CategoryActions = ({ type, parentId, setItems }: CategoryActionsProps) => {
  switch (type) {
    case CategoryType.Papers:
      return (
        <div className="h-full flex items-center gap-x-2">
          <PaperUploader categoryId={parentId} setItems={setItems} />
          <CategoryCreator type={type} parentId={parentId} setItems={setItems} />
        </div>
      );
    default:
      return null;
  }
};

// 这里的item包含Category, Paper和Note
export const ItemsBrowser = ({
  category,
  parentId,
  initItems,
}: ItemsBrowserProps) => {
  if (!category) {
    category = defaultCategories.find((c) => c.id === parentId)
  }
  const [query, setQuery] = useState("");
  const [originalItems, setOriginalItems] = useState<DashboardItem[]>(initItems);
  const [filteredItems, setFilteredItems] = useState<DashboardItem[]>(initItems);

  // 定义 setItems 函数来更新 originalItems
  const setItems = (items: DashboardItem[]) => {
    setOriginalItems(items);
  };

  useEffect(() => {
    const filterByQuery = (item: DashboardItem) =>
      item.label.toLowerCase().includes(query.toLowerCase());
    setFilteredItems(originalItems.filter(filterByQuery));
  }, [query, originalItems])

  return (
    <>
      {!category ? (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <p className="text-red-500">加载失败</p>
          <p className="text-gray-500">未能找到对应的分类信息</p>
        </div>
      ) : (
        <div className="p-4 h-full w-full">
          <div className="w-full flex items-center justify-between">
            <div className="h-full w-full flex items-center justify-start gap-x-16">
              <div className="h-full font-semibold">
                {category.name}
              </div>
              {category.type === CategoryType.Papers && (
                <CategoryActions type={CategoryType.Papers} parentId={parentId} setItems={setItems} />
              )}
              {category.type === CategoryType.Markdowns && (
                <div className="h-full flex items-center gap-x-2">
                  <NoteCreator type={DashboardItemType.Markdown} categoryId={parentId} setItems={setItems} />
                  <CategoryCreator type={CategoryType.Markdowns} parentId={parentId} setItems={setItems} />
                </div>
              )}
              {category.type === CategoryType.Whiteboards && (
                <div className="h-full flex items-center gap-x-2">
                  <NoteCreator type={DashboardItemType.Whiteboard} categoryId={parentId} setItems={setItems} />
                  <CategoryCreator type={CategoryType.Whiteboards} parentId={parentId} setItems={setItems} />
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
          <div className="flex flex-1">
            <ItemsTable type={category.type as CategoryType} items={filteredItems} />
          </div>
        </div>
      )}
    </>
  )
}