"use client"

import { useState } from "react"
import { Search, Plus, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NoteCard } from "@/components/note-card"
import { NoteSkeleton } from "@/components/note-skeleton"
import type { Note } from "@/lib/types"

interface NoteSidebarProps {
  notes: Note[]
  selectedNote: Note | null
  isOpen: boolean
  toggleSidebar: () => void
  onSelectNote: (note: Note) => void
  onCreateNote: () => void
  isLoading: boolean
}

export function NoteSidebar({
  notes,
  selectedNote,
  isOpen,
  toggleSidebar,
  onSelectNote,
  onCreateNote,
  isLoading,
}: NoteSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[240px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-900 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <h1 className="text-xl font-bold">Notes</h1>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        <div className="relative p-4">
          <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search notes..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <NoteSkeleton key={i} />
              ))}
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isSelected={selectedNote?.id === note.id}
                  onClick={() => onSelectNote(note)}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-center text-sm text-slate-500">
              {searchQuery ? "No notes match your search" : "No notes yet"}
            </div>
          )}
        </div>

        <div className="p-4">
          <Button
            onClick={onCreateNote}
            className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>
      </aside>

      {/* Mobile FAB */}
      <Button
        onClick={onCreateNote}
        className="fixed bottom-6 right-6 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 p-0 shadow-xl transition-transform hover:scale-105 md:hidden"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">New Note</span>
      </Button>

      {/* Mobile sidebar toggle */}
      <Button variant="outline" size="icon" onClick={toggleSidebar} className="fixed left-4 top-4 z-10 md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
    </>
  )
}
