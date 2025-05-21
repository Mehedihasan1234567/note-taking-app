"use client"

import { formatDistanceToNow } from "date-fns"
import { Card } from "@/components/ui/card"
import type { Note } from "@/lib/types"

interface NoteCardProps {
  note: Note
  isSelected: boolean
  onClick: () => void
}

export function NoteCard({ note, isSelected, onClick }: NoteCardProps) {
  const timeAgo = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })

  return (
    <Card
      onClick={onClick}
      className={`group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-l-4 border-l-indigo-600 bg-indigo-50 dark:border-l-purple-400 dark:bg-slate-800"
          : "border-l-4 border-transparent bg-gradient-to-r from-transparent to-transparent hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-slate-800/50 dark:hover:to-slate-800/50"
      }`}
    >
      <div className="p-3">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="truncate font-medium">{note.title}</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">{timeAgo}</span>
        </div>
        <p className="mb-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
          {note.content.replace(/<[^>]*>/g, "")}
        </p>
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex h-5 items-center rounded-full bg-indigo-100 px-2 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="inline-flex h-5 items-center rounded-full bg-slate-100 px-2 text-xs font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
