import { archiveNote, favoriteNote, removeNote, renameNote, updateContent, updateIcon } from "@/data/note"
import { NextResponse } from "next/server"

interface NoteIdProps {
  params: Promise<{
    noteId: string
  }>
}

export const PATCH = async (
  req: Request,
  { params }: NoteIdProps
) => {
  try {
    const { noteId } = await params
    const body = await req.json()
    const { title, archived, favorited, content, icon } = body
    if (title) {
      const renamedNote = await renameNote(noteId, title)
      if (renamedNote) {
        return NextResponse.json(renamedNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else if (icon) {
      const updatedNote = await updateIcon(noteId, icon)
      if (updatedNote) {
        return NextResponse.json(updatedNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else if (favorited === true) {
      const favoritedNote = await favoriteNote(noteId, true)
      if (favoritedNote) {
        return NextResponse.json(favoritedNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else if (favorited === false) {
      const unfavoritedNote = await favoriteNote(noteId, false)
      if (unfavoritedNote) {
        return NextResponse.json(unfavoritedNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else if (archived === true) {
      const archivedNote = await archiveNote(noteId, true)
      if (archivedNote) {
        return NextResponse.json(archivedNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else if (archived === false) {
      const restoredNote = await archiveNote(noteId, false)
      if (restoredNote) {
        return NextResponse.json(restoredNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else if (content !== null) {
      const updatedNote = await updateContent(noteId, content)
      if (updatedNote) {
        return NextResponse.json(updatedNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else {
      return new NextResponse("Unexpected field", { status: 404 })
    }
  } catch (error) {
    console.log("UPDATE NOTE ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export const DELETE = async (
  request: Request,
  { params }: NoteIdProps
) => {
  try {
    const { noteId } = await params
    const removedNote = await removeNote(noteId)
    if (removedNote) {
      return new NextResponse("Note removed", { status: 200 })
    }
  } catch (error) {
    console.log("DELETE NOTE ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}