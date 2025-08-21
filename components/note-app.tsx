"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { NoteSidebar } from "@/components/note-sidebar";
import { NoteEditor } from "@/components/note-editor";
import { EmptyState } from "@/components/empty-state";
import { LoginForm } from "@/components/login-form";
import type { Note, User } from "@/lib/types";
import { fetchNotes, createNote, updateNote, deleteNote, getCurrentUser, logout } from "@/lib/api";

export function NoteApp() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function checkAuth() {
    setIsAuthLoading(true);
    try {
      const { user } = await getCurrentUser();
      setUser(user);
    } catch (err) {
      setUser(null);
    }
    setIsAuthLoading(false);
  }

  async function loadNotes() {
    setIsLoading(true);
    setError(null);
    try {
      const notes = await fetchNotes();
      setNotes(notes);
      setSelectedNote(notes.length > 0 ? notes[0] : null);
    } catch (err: any) {
      setError(err.message);
    }
    setIsLoading(false);
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const createNewNote = async () => {
    setError(null);
    try {
      const newNote = await createNote({
        title: "Untitled Note",
        content: "New note...",
        tags: [],
      });
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateNoteHandler = async (updatedNote: Note) => {
    setError(null);
    try {
      const note = await updateNote(updatedNote);
      const updatedNotes = notes.map((n) => (n.id === note.id ? note : n));
      setNotes(updatedNotes);
      setSelectedNote(note);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteNoteHandler = async (noteId: string) => {
    setError(null);
    try {
      await deleteNote(noteId);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      setSelectedNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setNotes([]);
      setSelectedNote(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <NoteSidebar
        notes={notes}
        selectedNote={selectedNote}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onSelectNote={setSelectedNote}
        onCreateNote={createNewNote}
        onLogout={handleLogout}
        user={user}
        isLoading={isLoading}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {error && (
          <div className="p-4 text-red-600 bg-red-50 border-b border-red-200">
            {error}
          </div>
        )}
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onUpdateNote={updateNoteHandler}
            onDeleteNote={deleteNoteHandler}
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
            theme={theme || "light"}
          />
        ) : (
          <EmptyState onCreateNote={createNewNote} />
        )}
      </div>
    </div>
  );
}
