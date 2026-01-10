import { useDocument, useUpdateDocument } from "@/hooks/use-documents";
import { DocumentEditor } from "@/components/DocumentEditor";
import { useRoute } from "wouter";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function EditorPage() {
  const [, params] = useRoute("/document/:id");
  const id = parseInt(params?.id || "0");
  const { data: document, isLoading, error } = useDocument(id);
  const updateMutation = useUpdateDocument();

  const handleSave = (content: any, settings: { headerContent: string; footerContent: string; showPageNumbers: boolean }) => {
    updateMutation.mutate({
      id,
      content,
      ...settings,
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-500 font-medium">Loading your masterpiece...</p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="bg-destructive/10 p-4 rounded-full">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Document not found</h2>
        <p className="text-slate-500 max-w-md text-center">
          The document you are looking for does not exist or has been deleted.
        </p>
        <Button asChild>
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <DocumentEditor 
      initialContent={document.content}
      initialHeader={document.headerContent || ""}
      initialFooter={document.footerContent || ""}
      initialShowPageNumbers={document.showPageNumbers ?? true}
      onSave={handleSave}
      isSaving={updateMutation.isPending}
    />
  );
}
