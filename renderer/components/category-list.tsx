"use client"

import { SidebarItem } from "./sidebar-item"
import { CategoryWithIcon } from "@/types/types"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useMemo, useCallback } from "react"
import { memo } from 'react';


interface CategoryListProps {
  parentId: string
  categories: CategoryWithIcon[]
  level: number
  isLoading?: boolean
}

export const CategoryList = memo(({
  parentId,
  categories,
  level,
  isLoading
}: CategoryListProps) => {
  const params = useParams()
  const router = useRouter()

  // 使用 localStorage 持久化展开状态
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('categoryExpanded')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  // 保存展开状态到 localStorage
  useEffect(() => {
    localStorage.setItem('categoryExpanded', JSON.stringify(expanded))
  }, [expanded])

  const subCategories = useMemo(() =>
    categories.filter((category) => category.parentId === parentId),
    [categories, parentId]
  );

  const handleExpand = useCallback((categoryId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [categoryId]: !prevExpanded[categoryId]
    }));
  }, []);

  if (isLoading) {
    return (
      <>
        <SidebarItem.Skeleton level={level} />
        <SidebarItem.Skeleton level={level} />
        <SidebarItem.Skeleton level={level} />
      </>
    );
  }

  if (!subCategories || subCategories.length === 0) {
    return null; // 空数据时直接返回 null，不显示骨架屏
  }
  return (
    <>
      {subCategories && subCategories.length > 0 && subCategories
        .map((category) => (
          <div key={category.id} className="w-full">
            <SidebarItem
              id={category.id}
              label={category.name}
              icon={category.icon}
              active={params.categoryId === category.id || (params.categoryId === undefined && category.id === "library")}
              level={level}
              onClick={() => { router.push(`/dashboard/${category.id}`) }}
              onExpand={() => handleExpand(category.id)}
              expanded={expanded[category.id]}
              showExpandIcon={categories.filter((item) => item.parentId === category.id).length > 0}
            />
            {expanded[category.id] && (
              <CategoryList
                parentId={category.id}
                categories={categories}
                level={level + 1}
              />
            )}
          </div>
        ))
      }
    </>
  )

})
