// app/api/notes/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { cookies } from "next/headers";

const noteSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  tags: z.array(z.string().max(20)).max(5),
});

// Types for request bodies
interface NoteCreateBody {
  title: string;
  content: string;
  tags: string[];
}
interface NoteDeleteBody {
  id: string;
}

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('userId')?.value || null;
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body: NoteCreateBody = await req.json();
    const { title, content, tags } = noteSchema.parse(body);

    const newNote = await prisma.note.create({
      data: { title, content, tags, userId },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error: any) {
    const message =
      process.env.NODE_ENV === "development" && error?.message
        ? error.message
        : "Invalid note data";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("q") || "";
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];

    const notes = await prisma.note.findMany({
      where: {
        userId, // Only fetch notes for the authenticated user
        OR: [
          { title: { contains: searchQuery } },
          { content: { contains: searchQuery } },
        ],
        ...(tags.length > 0 ? { tags: { hasEvery: tags } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error: any) {
    const message =
      process.env.NODE_ENV === "development" && error?.message
        ? error.message
        : "Failed to fetch notes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id }: NoteDeleteBody = await req.json();
    // Check if note exists and belongs to the user
    const note = await prisma.note.findFirst({ 
      where: { id, userId } 
    });
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    await prisma.note.delete({
      where: { id },
    });
    return NextResponse.json(null, { status: 204 });
  } catch (error: any) {
    const message =
      process.env.NODE_ENV === "development" && error?.message
        ? error.message
        : "Invalid note ID";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, content, tags } = body;
    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Check if note belongs to the user
    const existingNote = await prisma.note.findFirst({
      where: { id, userId }
    });
    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Validate fields if provided
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    // Optionally validate with Zod
    if (title !== undefined || content !== undefined || tags !== undefined) {
      noteSchema.partial().parse({ title, content, tags });
    }
    const updatedNote = await prisma.note.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updatedNote);
  } catch (error: any) {
    const message =
      process.env.NODE_ENV === "development" && error?.message
        ? error.message
        : "Failed to update note";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
