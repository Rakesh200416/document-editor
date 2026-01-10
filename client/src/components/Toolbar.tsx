import { Editor } from "@tiptap/react";
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Heading1, Heading2, Heading3,
  Printer, FileDown, Undo, Redo, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  editor: Editor | null;
  onPrint: () => void;
  onExportPdf: () => void;
  isSaving?: boolean;
}

export function Toolbar({ editor, onPrint, onExportPdf, isSaving }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border shadow-sm print:hidden">
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          
          <Link href="/" className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 w-9"
          )}>
            <ChevronLeft className="h-4 w-4" />
          </Link>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* History */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Typography */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive("heading", { level: 1 }) ? "bg-accent text-accent-foreground" : ""}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive("heading", { level: 2 }) ? "bg-accent text-accent-foreground" : ""}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive("heading", { level: 3 }) ? "bg-accent text-accent-foreground" : ""}
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Formatting */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-accent text-accent-foreground" : ""}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-accent text-accent-foreground" : ""}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "bg-accent text-accent-foreground" : ""}
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "bg-accent text-accent-foreground" : ""}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Alignment */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor.isActive({ textAlign: 'left' }) ? "bg-accent text-accent-foreground" : ""}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? "bg-accent text-accent-foreground" : ""}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? "bg-accent text-accent-foreground" : ""}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={editor.isActive({ textAlign: 'justify' }) ? "bg-accent text-accent-foreground" : ""}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-accent text-accent-foreground" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-accent text-accent-foreground" : ""}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-xs text-muted-foreground animate-pulse mr-2">
              Saving...
            </span>
          )}
          
          <Button variant="outline" size="sm" onClick={onPrint} className="gap-2 hidden md:flex">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="default" size="sm" onClick={onExportPdf} className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 hover:shadow-primary/30">
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
