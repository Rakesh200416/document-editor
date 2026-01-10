import { useDocuments, useCreateDocument, useDeleteDocument } from "@/hooks/use-documents";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Trash2, MoreVertical, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function Home() {
  const { data: documents, isLoading } = useDocuments();
  const createMutation = useCreateDocument();
  const deleteMutation = useDeleteDocument();
  const [, setLocation] = useLocation();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleCreate = async () => {
    const newDoc = await createMutation.mutateAsync({
      title: "Untitled Document",
      content: {},
      headerContent: "",
      footerContent: "",
      showPageNumbers: true,
    });
    setLocation(`/document/${newDoc.id}`);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="bg-white border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-display">
            DocuFlow
          </h1>
        </div>
        <Button onClick={handleCreate} disabled={createMutation.isPending} className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
          {createMutation.isPending ? "Creating..." : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              New Document
            </>
          )}
        </Button>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3].map(i => (
               <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse" />
             ))}
          </div>
        ) : documents?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No documents yet</h3>
            <p className="text-slate-500 mt-2 mb-6 max-w-sm mx-auto">Create your first document to start writing. It will be beautiful.</p>
            <Button onClick={handleCreate} variant="outline">Create Document</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documents?.map((doc) => (
              <Card key={doc.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-1 text-lg font-medium group-hover:text-primary transition-colors">
                      <Link href={`/document/${doc.id}`}>{doc.title}</Link>
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(doc.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="flex items-center text-xs mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {doc.updatedAt && formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/document/${doc.id}`}>
                    <div className="h-32 bg-slate-50 rounded-md border border-slate-100 p-4 overflow-hidden relative group-hover:bg-white transition-colors">
                      <div className="w-full h-full text-[6px] text-slate-300 leading-relaxed select-none">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-50 group-hover:from-white to-transparent h-10 top-auto bottom-0" />
                    </div>
                  </Link>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="secondary" className="w-full opacity-0 group-hover:opacity-100 transition-all duration-300" asChild>
                    <Link href={`/document/${doc.id}`}>Open Editor</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
