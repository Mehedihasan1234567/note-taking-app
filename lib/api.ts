import type { Note, User } from "@/lib/types";

export async function fetchNotes() {
  const res = await fetch("/api/notes");
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json() as Promise<Note[]>;
}

export async function createNote(note: Partial<Note>) {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json() as Promise<Note>;
}

export async function updateNote(note: Note) {
  const res = await fetch("/api/notes", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json() as Promise<Note>;
}

export async function deleteNote(id: string) {
  if (!id) throw new Error("Note ID is required for deletion");
  console.log("Deleting note with id:", id);
  const res = await fetch("/api/notes", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (res.status === 404) {
    // Note already gone, treat as success
    return;
  }
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete note");
}

// Auth functions
export async function login(email: string, name?: string) {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Login failed" }));
    throw new Error(errorData.error || "Login failed");
  }
  return res.json() as Promise<{ user: User }>;
}

export async function getCurrentUser() {
  const res = await fetch("/api/auth");
  if (!res.ok) throw new Error("Failed to get current user");
  return res.json() as Promise<{ user: User | null }>;
}

export async function logout() {
  const res = await fetch("/api/auth", { method: "DELETE" });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}
