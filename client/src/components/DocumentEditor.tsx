import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Typography from "@tiptap/extension-typography";
import { FontSize } from "@/lib/tiptap-extensions";
import { useState, useEffect, useRef } from "react";
import { Toolbar } from "./Toolbar";
import { PageBackdrop } from "./PageBackdrop";
import { SettingsDialog } from "./SettingsDialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
// Dynamic import for html2pdf to avoid SSR issues if any, though standard import works in client
import html2pdf from "html2pdf.js";

interface DocumentEditorProps {
  initialContent?: any;
  initialHeader?: string;
  initialFooter?: string;
  initialShowPageNumbers?: boolean;
  onSave: (content: any, settings: { headerContent: string; footerContent: string; showPageNumbers: boolean }) => void;
  isSaving?: boolean;
}

const PAGE_HEIGHT = 1056; // 11in @ 96dpi

export function DocumentEditor({ 
  initialContent, 
  initialHeader = "", 
  initialFooter = "", 
  initialShowPageNumbers = true,
  onSave,
  isSaving 
}: DocumentEditorProps) {
  const { toast } = useToast();
  const [pageCount, setPageCount] = useState(1);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Settings State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [headerContent, setHeaderContent] = useState(initialHeader);
  const [footerContent, setFooterContent] = useState(initialFooter);
  const [showPageNumbers, setShowPageNumbers] = useState(initialShowPageNumbers);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start typing your document..." }),
      TextStyle,
      FontFamily,
      FontSize,
      Typography,
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none w-full h-full",
      },
    },
    onUpdate: ({ editor }) => {
      // Debounced save could go here
      // For now we just check height
      checkHeight();
    },
  });

  // Effect to update height on content change
  const checkHeight = () => {
    if (editorRef.current) {
      const height = editorRef.current.scrollHeight;
      const pages = Math.ceil(height / PAGE_HEIGHT) || 1;
      setPageCount(pages);
    }
  };

  useEffect(() => {
    // Initial check
    const timer = setTimeout(checkHeight, 500);
    return () => clearTimeout(timer);
  }, [editor]);

  // Handle Resize
  useEffect(() => {
    if (!editorRef.current) return;
    const observer = new ResizeObserver(checkHeight);
    observer.observe(editorRef.current);
    return () => observer.disconnect();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    const element = document.getElementById("document-export-container");
    if (!element) return;

    const opt = {
      margin: 0,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    toast({ title: "Generating PDF..." });
    html2pdf().set(opt).from(element).save().then(() => {
      toast({ title: "PDF Downloaded" });
    });
  };

  // Auto-save effect or manual save trigger
  // For this demo, let's auto-save on change (debounced) would be ideal, 
  // but to keep it simple with props, let's expose current state when needed.
  // Actually, let's make a manual save or simple interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (editor) {
        onSave(editor.getJSON(), { headerContent, footerContent, showPageNumbers });
      }
    }, 5000); // Auto-save every 5s

    return () => clearInterval(interval);
  }, [editor, headerContent, footerContent, showPageNumbers, onSave]);

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      <Toolbar 
        editor={editor} 
        onPrint={handlePrint} 
        onExportPdf={handleExportPdf}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex-1 overflow-y-auto relative p-8 flex justify-center scroll-smooth">
        {/* Visual Wrapper for Export/Print */}
        <div id="document-export-container" className="relative w-[816px] min-h-[1056px]">
          
          {/* Background Pages Layer */}
          <PageBackdrop 
            pageCount={pageCount} 
            headerContent={headerContent} 
            footerContent={footerContent} 
            showPageNumbers={showPageNumbers}
          />

          {/* Editor Layer */}
          <div 
            ref={editorRef}
            className="absolute top-0 left-0 w-full min-h-[1056px] z-10 px-[96px] py-[96px]" // 1 inch padding
            style={{ 
              marginBottom: "24px",
            }}
          >
            <EditorContent editor={editor} className="editor-canvas w-full h-full" />
          </div>

        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        {isSaving && (
           <div className="bg-background/80 backdrop-blur border border-border rounded-full px-4 py-2 text-xs font-medium flex items-center gap-2 shadow-lg">
             <Loader2 className="w-3 h-3 animate-spin" />
             Saving...
           </div>
        )}
      </div>

      <SettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen}
        headerContent={headerContent}
        footerContent={footerContent}
        showPageNumbers={showPageNumbers}
        onSave={(settings) => {
          setHeaderContent(settings.headerContent);
          setFooterContent(settings.footerContent);
          setShowPageNumbers(settings.showPageNumbers);
          // Trigger immediate save
          if (editor) {
            onSave(editor.getJSON(), settings);
          }
        }}
      />
    </div>
  );
}
