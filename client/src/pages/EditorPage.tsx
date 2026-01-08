import { useEffect, useCallback, useState } from "react";
import { useRoute } from "wouter";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useDocument, useUpdateDocument } from "@/hooks/use-documents";
import { Toolbar } from "@/components/Toolbar";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

// A4/Letter size constants
const PAGE_HEIGHT_PX = 1056; // 11in @ 96dpi
const PAGE_GAP_PX = 20;

export default function EditorPage() {
  const [, params] = useRoute("/document/:id");
  const id = params?.id ? parseInt(params.id) : null;
  
  const { data: document, isLoading } = useDocument(id);
  const { mutate: updateDocument } = useUpdateDocument();
  const [content, setContent] = useState<any>(null);
  const debouncedContent = useDebounce(content, 2000); // Auto-save every 2s

  // Editor initialization
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[900px]',
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getJSON());
    },
  });

  // Load content when document is fetched
  useEffect(() => {
    if (document && editor && !editor.getText()) {
      // Only set content if editor is empty to prevent overwriting unsaved changes
      if (document.content) {
        editor.commands.setContent(document.content as any);
      }
    }
  }, [document, editor]);

  // Auto-save effect
  useEffect(() => {
    if (debouncedContent && id) {
      updateDocument({
        id,
        content: debouncedContent,
        title: document?.title || 'Untitled', // Keep existing title
      });
    }
  }, [debouncedContent, id]);

  // Handle title update
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (id) {
      updateDocument({
        id,
        title: e.target.value,
      });
    }
  };

  if (isLoading || !editor) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F5F8] flex flex-col print:bg-white print:h-auto">
      <Toolbar editor={editor} title={document?.title} />
      
      {/* Title Input - Only visible in UI, not print */}
      <div className="w-full max-w-[816px] mx-auto mt-8 px-8 print:hidden">
        <input
          type="text"
          value={document?.title || ''}
          onChange={handleTitleChange}
          placeholder="Document Title"
          className="text-3xl font-bold bg-transparent border-none outline-none placeholder:text-slate-300 w-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto py-8 print:p-0 print:overflow-visible">
        {/* Page Container */}
        <div 
          className="
            relative mx-auto bg-white shadow-xl print:shadow-none
            w-[816px] min-h-[1056px] 
            px-[96px] py-[96px] 
            transition-all duration-300
            border border-slate-200/60 print:border-none
          "
          onClick={() => editor.chain().focus().run()}
        >
          {/* Simulated Page Breaks */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden print:hidden">
            {/* 
              This creates visual markers for page breaks.
              Since content is in one editor, this is purely visual 
              to guide the user on where pages end.
             */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i}
                className="page-break-marker"
                style={{ top: `${(i + 1) * PAGE_HEIGHT_PX}px` }}
              />
            ))}
          </div>

          <EditorContent editor={editor} />
        </div>
        
        <div className="text-center mt-8 text-xs text-muted-foreground print:hidden pb-8">
          Page 1 of 1 • WordSim Editor
        </div>
      </div>
    </div>
  );
}
