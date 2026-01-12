import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
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
    // Trigger print directly without additional styling
    window.print();
  };

  const handleExportPdf = () => {
    // Create a temporary container with actual page breaks for PDF export
    const tempContainer = document.createElement('div');
    tempContainer.id = 'pdf-export-container';
    tempContainer.style.width = '8.5in';
    tempContainer.style.backgroundColor = 'white';
    
    // Clone the editor content
    const editorContent = editorRef.current?.cloneNode(true) as HTMLElement;
    if (editorContent) {
      editorContent.style.position = 'static';
      editorContent.style.top = '0';
      editorContent.style.left = '0';
      editorContent.style.transform = 'none';
      
      // Create pages with proper sizing
      for (let i = 0; i < pageCount; i++) {
        const pageDiv = document.createElement('div');
        pageDiv.style.height = '11in';
        pageDiv.style.width = '8.5in';
        pageDiv.style.padding = '1in';
        pageDiv.style.boxSizing = 'border-box';
        pageDiv.style.pageBreakAfter = i < pageCount - 1 ? 'always' : 'auto';
        pageDiv.style.position = 'relative';
        
        // Add header to each page
        if (headerContent) {
          const headerDiv = document.createElement('div');
          headerDiv.innerHTML = `<div style="position: absolute; top: 0; left: 0; right: 0; height: 0.5in; padding: 0.25in 0.5in; border-bottom: 1px solid #ccc; font-size: 12px;">${headerContent}</div>`;
          pageDiv.appendChild(headerDiv);
        }
        
        // Add footer to each page
        const footerDiv = document.createElement('div');
        footerDiv.innerHTML = `<div style="position: absolute; bottom: 0; left: 0; right: 0; height: 0.5in; padding: 0.25in 0.5in; border-top: 1px solid #ccc; font-size: 12px; text-align: right;">Page ${i + 1} of ${pageCount}</div>`;
        pageDiv.appendChild(footerDiv);
        
        // Add editor content to the page
        const contentClone = editorContent.cloneNode(true) as HTMLElement;
        contentClone.style.position = 'relative';
        contentClone.style.top = '0';
        contentClone.style.left = '0';
        contentClone.style.transform = 'none';
        contentClone.style.marginBottom = '0';
        
        // Calculate how much content fits on this page
        if (i > 0) {
          // For subsequent pages, we'd need to slice content appropriately
          // For now, we'll duplicate content and let html2pdf handle page breaks
          contentClone.style.paddingTop = headerContent ? '0.75in' : '0.5in';
          contentClone.style.paddingBottom = '0.75in';
        } else {
          contentClone.style.paddingTop = headerContent ? '0.75in' : '0.5in';
          contentClone.style.paddingBottom = '0.75in';
        }
        
        pageDiv.appendChild(contentClone);
        tempContainer.appendChild(pageDiv);
      }
    }
    
    document.body.appendChild(tempContainer);
    
    const opt = {
      margin: 0,
      filename: 'document.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };

    toast({ title: "Generating PDF..." });
    html2pdf()
      .set(opt)
      .from(tempContainer)
      .save()
      .then(() => {
        toast({ title: "PDF Downloaded" });
      })
      .finally(() => {
        // Clean up temporary container
        document.body.removeChild(tempContainer);
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
