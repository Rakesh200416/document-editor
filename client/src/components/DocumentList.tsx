import { useDocuments, useDeleteDocument } from "@/hooks/use-documents";
import { Link } from "wouter";
import { format } from "date-fns";
import { FileText, MoreVertical, Trash2, Calendar, Edit3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";

export function DocumentList() {
  const { data: documents, isLoading, isError } = useDocuments();
  const { mutate: deleteDocument } = useDeleteDocument();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl border p-6 space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !documents) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-full mb-4">
          <FileText className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground">Unable to load your documents.</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-card border border-dashed border-border rounded-3xl">
        <div className="bg-primary/5 text-primary p-6 rounded-2xl mb-6 shadow-sm">
          <FileText className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold mb-2 font-display text-foreground">No documents yet</h3>
        <p className="text-muted-foreground max-w-sm mb-8 text-lg">
          Create your first document to start writing.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div 
            key={doc.id}
            className="group relative bg-card hover:bg-accent/30 border border-border/60 hover:border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <Link href={`/document/${doc.id}`} className="absolute inset-0 z-0" />
            
            <div className="relative z-10 flex items-start justify-between mb-6">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner">
                <FileText className="h-6 w-6" />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                  <DropdownMenuItem asChild>
                    <Link href={`/document/${doc.id}`} className="flex items-center cursor-pointer">
                      <Edit3 className="mr-2 h-4 w-4" /> Open
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setDeleteId(doc.id)}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="relative z-10">
              <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {doc.title}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-2 opacity-70" />
                {doc.updatedAt 
                  ? format(new Date(doc.updatedAt), 'MMM d, yyyy')
                  : 'Just now'
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg"
              onClick={() => {
                if (deleteId) deleteDocument(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
