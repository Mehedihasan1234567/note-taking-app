"use client";

import { useRef, useEffect } from "react";
import { Bold, Italic, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value = "") => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="flex flex-col rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-1 border-b border-slate-200 p-2 dark:border-slate-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => execCommand("bold")}
          className="h-8 w-8"
        >
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => execCommand("italic")}
          className="h-8 w-8"
        >
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => execCommand("insertUnorderedList")}
          className="h-8 w-8"
        >
          <List className="h-4 w-4" />
          <span className="sr-only">Bullet List</span>
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[300px] flex-1 p-4 outline-none"
        onInput={updateContent}
        onBlur={updateContent}
      />
    </div>
  );
}
