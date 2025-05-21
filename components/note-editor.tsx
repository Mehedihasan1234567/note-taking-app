"use client"

import { useState, useEffect } from "react"
import { Menu, Trash2, Tag, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RichTextEditor } from "@/components/rich-text-editor"
import type { Note } from "@/lib/types"

interface NoteEditorProps {
  note: Note
  onUpdateNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
  toggleSidebar: () => void
  isSidebarOpen: boolean
  toggleTheme: () => void
  theme: string
}

export function NoteEditor({
  note,
  onUpdateNote,
  onDeleteNote,
  toggleSidebar,
  isSidebarOpen,
  toggleTheme,
  theme,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState(note.tags)
  const [isSaved, setIsSaved] = useState(true)
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  // Available tags for the dropdown
  const availableTags = [
    "Personal",
    "Work",
    "Ideas",
    "Tasks",
    "Important",
    "Learning",
    "Project",
    "Meeting",
    "Research",
    "Finance",
  ]

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags)
    setIsSaved(true)
  }, [note])

  // Auto-save functionality
  const handleChange = (newTitle: string, newContent: string, newTags: string[]) => {
    setTitle(newTitle)
    setContent(newContent)
    setTags(newTags)
    setIsSaved(false)

    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    // Set new timeout for auto-save
    const timeout = setTimeout(() => {
      onUpdateNote({
        ...note,
        title: newTitle || "Untitled Note",
        content: newContent,
        tags: newTags,
      })
      setIsSaved(true)
    }, 1000)

    setSaveTimeout(timeout)
  }

  // Add a tag
  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag]
      setTags(newTags)
      handleChange(title, content, newTags)
    }
  }

  // Remove a tag
  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag)
    setTags(newTags)
    handleChange(title, content, newTags)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Editor header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <Input
            value={title}
            onChange={(e) => handleChange(e.target.value, content, tags)}
            placeholder="Untitled Note"
            className="border-none bg-transparent px-0 text-xl font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isSaved ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
            {isSaved ? "Saved ✓" : "Saving..."}
          </span>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-auto p-4">
        <RichTextEditor value={content} onChange={(newContent) => handleChange(title, newContent, tags)} />
      </div>

      {/* Editor footer */}
      <div className="flex items-center justify-between border-t border-slate-200 p-4 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Tag className="h-4 w-4" />
                Add Tag
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableTags
                .filter((tag) => !tags.includes(tag))
                .map((tag) => (
                  <DropdownMenuItem key={tag} onClick={() => addTag(tag)}>
                    {tag}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {tags.map((tag) => (
            <div
              key={tag}
              className="flex h-7 items-center gap-1 rounded-full bg-indigo-100 px-2 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteNote(note.id)}
          className="text-red-500 hover:bg-red-100 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
        >
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">Delete note</span>
        </Button>
      </div>
    </div>
  )
}
