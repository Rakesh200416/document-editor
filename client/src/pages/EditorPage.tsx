import { useEffect, useState, useRef, useCallback } from "react";
import { useRoute } from "wouter";
import { useDocument, useUpdateDocument } from "@/hooks/use-documents";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import { Toolbar } from "@/components/Toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
// @ts-ignore - html2pdf doesn't have good types
import html2pdf from "html2pdf.js";

const PAGE_HEIGHT = 1056; // 11in * 96dpi
const PAGE_WIDTH = 816;   // 8.5in * 96dpi
const PAGE_GAP = 24;      // Space between pages

export default function EditorPage() {
  const [, params] = useRoute("/document/:id");
  const id = parseInt(params?.id || "0");
  const { data: document, isLoading, error } = useDocument(id);
  const updateDocument = useUpdateDocument();
  const { toast } = useToast();
  
  const [totalPages, setTotalPages] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Debounce save function
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: "Start typing your masterpiece...",
      }),
      Image,
    ],
    content: document?.content || { type: 'doc', content: [] },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[1056px] w-[816px] px-[96px] py-[96px]",
      },
    },
    onUpdate: ({ editor }) => {
      // Calculate pages
      if (editorRef.current) {
        const height = editorRef.current.scrollHeight;
        const pages = Math.max(1, Math.ceil(height / PAGE_HEIGHT));
        setTotalPages(pages);
      }

      // Auto-save
      setIsSaving(true);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      
      saveTimeoutRef.current = setTimeout(() => {
        updateDocument.mutate(
          { id, content: editor.getJSON() },
          { onSuccess: () => setIsSaving(false) }
        );
      }, 1000);
    },
  });

  // Sync content when document loads
  useEffect(() => {
    if (document && editor && !editor.isDestroyed && editor.isEmpty) {
      editor.commands.setContent(document.content as any);
      // Recalculate pages after content load
      setTimeout(() => {
         if (editorRef.current) {
          const height = editorRef.current.scrollHeight;
          const pages = Math.max(1, Math.ceil(height / PAGE_HEIGHT));
          setTotalPages(pages);
        }
      }, 100);
    }
  }, [document, editor]);

  // Export PDF Handler
  const handleExportPdf = useCallback(() => {
    if (!editorRef.current) return;
    
    const element = editorRef.current;
    const opt = {
      margin: 0,
      filename: `${document?.title || 'document'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    toast({ title: "Exporting PDF...", description: "Please wait while we generate your file." });
    
    // Temporarily remove transform/positioning to capture full height
    const originalStyle = element.style.cssText;
    
    html2pdf().set(opt).from(element).save().then(() => {
      toast({ title: "Success", description: "PDF downloaded successfully." });
    });
  }, [document]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading Editor...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-muted/30">
        <div className="text-center max-w-md p-6 bg-card rounded-2xl shadow-lg border border-border">
          <h2 className="text-xl font-bold text-destructive mb-2">Failed to load document</h2>
          <p className="text-muted-foreground">The document you requested might have been deleted or doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans">
      <Toolbar 
        editor={editor} 
        onPrint={handlePrint} 
        onExportPdf={handleExportPdf}
        isSaving={isSaving}
      />

      {/* Editor Workspace */}
      <div className="flex-1 overflow-auto relative py-12 px-4 print:p-0 print:overflow-visible">
        <div className="relative mx-auto w-max print:w-full print:m-0">
          
          {/* Layer 1: Visual Pages Backgrounds */}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center pointer-events-none print:hidden" style={{ gap: `${PAGE_GAP}px` }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <div 
                key={i}
                className="bg-white shadow-lg border border-black/5 relative"
                style={{ width: `${PAGE_WIDTH}px`, height: `${PAGE_HEIGHT}px` }}
              >
                {/* Header/Footer Placeholders */}
                <div className="absolute bottom-8 w-full text-center text-[10px] text-muted-foreground/50 font-mono">
                  Page {i + 1} of {totalPages}
                </div>
              </div>
            ))}
          </div>

          {/* Layer 2: Tiptap Editor (Overlay) */}
          <div className="relative z-10 print:static">
             <div 
              id="document-content" 
              ref={editorRef}
              className="mx-auto"
              style={{ width: `${PAGE_WIDTH}px` }}
             >
                <EditorContent editor={editor} className="font-serif text-lg leading-relaxed text-gray-800" />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
