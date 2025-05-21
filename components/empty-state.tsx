"use client";

import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchNotes, createNote, updateNote, deleteNote } from "@/lib/api";

interface EmptyStateProps {
  onCreateNote: () => void;
}

export function EmptyState({ onCreateNote }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-800">
        <FileText className="h-12 w-12 text-slate-400" />
      </div>
      <h2 className="mb-2 text-2xl font-bold">No Note Selected</h2>
      <p className="mb-6 max-w-md text-slate-500 dark:text-slate-400">
        Select a note from the sidebar or create a new one to get started with
        your note-taking journey.
      </p>
      <Button
        onClick={onCreateNote}
        className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
      >
        <Plus className="h-4 w-4" />
        Create New Note
      </Button>
    </div>
  );
}
