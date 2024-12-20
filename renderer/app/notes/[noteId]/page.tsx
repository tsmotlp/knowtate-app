import React from 'react'
import { PaperNote } from "@/app/papers/[paperId]/_components/paper-note"
import { getNoteWithPaper } from "@/data/note";

interface NoteIdPageProps {
  params: Promise<{
    noteId: string;
  }>
}

const NoteIdPage = async ({ params }: NoteIdPageProps) => {
  const { noteId } = await params
  const note = await getNoteWithPaper(noteId)
  return (
    <div>
      {note ? (
        <div className="size-full flex items-center justify-center p-8">
          <PaperNote paper={note.paper ? note.paper : undefined} note={note} showDashboardIcon={true} />
        </div>
      ) : (
        <div className="flex size-full items-center justify-center text-red-500">
          出错了
        </div>
      )}
    </div>
  )
}

export default NoteIdPage