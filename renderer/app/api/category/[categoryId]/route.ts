import { archiveCategory, favoriteCategory, removeCategory, renameCategory } from "@/data/category"
import { NextResponse } from "next/server"

interface CategoryIdProps {
  params: Promise<{
    categoryId: string
  }>
}

export const PATCH = async (
  req: Request,
  { params }: CategoryIdProps
) => {
  try {
    const { categoryId } = await params;
    const body = await req.json()
    const { name, favorited, archived } = body
    if (name) {
      const renamedCategory = await renameCategory(categoryId, name)
      if (renamedCategory) {
        return NextResponse.json(renamedCategory)
      }
      return new NextResponse("Failed to update category", { status: 500 })
    } else if (archived === true) {
      const archivedCategory = await archiveCategory(categoryId, true)
      if (archivedCategory) {
        return NextResponse.json(archivedCategory)
      }
      return new NextResponse("Failed to update category", { status: 500 })
    } else if (archived === false) {
      const restoredCategory = await archiveCategory(categoryId, false)
      if (restoredCategory) {
        return NextResponse.json(restoredCategory)
      }
      return new NextResponse("Failed to update category", { status: 500 })
    } else if (favorited === true) {
      const favoritedCategory = await favoriteCategory(categoryId, true)
      if (favoritedCategory) {
        return NextResponse.json(favoritedCategory)
      }
      return new NextResponse("Failed to update category", { status: 500 })
    } else if (favorited === false) {
      const unfavoritedCategory = await favoriteCategory(categoryId, false)
      if (unfavoritedCategory) {
        return NextResponse.json(unfavoritedCategory)
      }
      return new NextResponse("Failed to update category", { status: 500 })
    } else {
      return new NextResponse("Unexpected field", { status: 404 })
    }
  } catch (error) {
    console.log("UPDATE CATEGORY ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export const DELETE = async (
  request: Request,
  { params }: CategoryIdProps
) => {
  try {
    const { categoryId } = await params;
    const removedCategory = await removeCategory(categoryId)
    if (removedCategory) {
      return new NextResponse("Category removed", { status: 200 })
    }
  } catch (error) {
    console.log("DELETE CATEGORY ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}