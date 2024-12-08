import React from 'react';
import { getArchivedCategories, getCategoriesByParent, getCategory, getFavoritedCategories } from "@/data/category"
import { getArchivedNotesWithPaper, getFavoritedNotesWithPaper, getNotesWithPaper } from "@/data/note"
import { getArchivedPapers, getFavoritedPapers, getPapers, getRecentPapers } from "@/data/paper"
import { ItemsBrowser } from "../_components/items-browser"
import { DashboardItem, DashboardItemType, NoteWithPaper } from "@/types/types"
import { Category, Paper } from "@prisma/client"
import { RecentBrowser } from "../_components/recent-browser"

interface CategoryIdPageProps {
  params: Promise<{
    categoryId: string
  }>
}

const fetchData = async (categoryId: string) => {
  let result;

  switch (categoryId) {
    case "recents":
      result = {
        papers: await getRecentPapers(),
        subCategories: [],
        notes: []
      };
      break;
    case "trash":
      result = {
        subCategories: await getArchivedCategories(),
        notes: await getArchivedNotesWithPaper(),
        papers: await getArchivedPapers()
      };
      break;
    case "favorites":
      result = {
        subCategories: await getFavoritedCategories(),
        notes: await getFavoritedNotesWithPaper(),
        papers: await getFavoritedPapers()
      };
      break;
    default:
      result = {
        subCategories: await getCategoriesByParent(categoryId),
        notes: await getNotesWithPaper(categoryId),
        papers: await getPapers(categoryId)
      };
      break;
  }

  return result;
};

const CategoryIdPage = async ({ params }: CategoryIdPageProps) => {
  const { categoryId } = await params;
  const category = await getCategory(categoryId)
  const { subCategories, notes, papers } = await fetchData(categoryId);

  const mapToDashboardItem = {
    category: (c: Category): DashboardItem => ({
      id: c.id,
      label: c.name,
      type: DashboardItemType.Category,
      archived: c.archived,
      favorited: c.favorited,
      url: null,
      authors: null,
      publication: null,
      publicationDate: null,
      paperTile: null,
      paperId: null,
      lastEdit: c.updatedAt,
    }),
    paper: (p: Paper): DashboardItem => ({
      id: p.id,
      label: p.title,
      type: DashboardItemType.Paper,
      archived: p.archived,
      favorited: p.favorited,
      url: p.url,
      authors: p.authors,
      publication: p.publication,
      publicationDate: p.publicateDate,
      paperTile: null,
      paperId: null,
      lastEdit: p.updatedAt,
    }),
    note: (n: NoteWithPaper): DashboardItem => ({
      id: n.id,
      label: n.title,
      type: n.type as DashboardItemType,
      archived: n.archived,
      favorited: n.favorited,
      url: null,
      authors: null,
      publication: null,
      publicationDate: null,
      paperTile: n.paper?.title || null,
      paperId: n.paperId,
      lastEdit: n.updatedAt,
    })
  };

  const items: DashboardItem[] = [
    ...(subCategories?.map(mapToDashboardItem.category) || []),
    ...(papers?.map(mapToDashboardItem.paper) || []),
    ...(notes?.map(mapToDashboardItem.note) || [])
  ];

  return (
    <div className="size-full">
      {categoryId === "recents" ? (
        <RecentBrowser
          category={category}
          parentId={categoryId}
          initItems={items}
        />
      ) : (
        <ItemsBrowser
          category={category}
          parentId={categoryId}
          initItems={items}
        />
      )}
    </div>
  )
}

export default CategoryIdPage