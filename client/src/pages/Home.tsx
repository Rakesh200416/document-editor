import { useDocuments, useDeleteDocument } from "@/hooks/use-documents";
import { CreateDocumentDialog } from "@/components/CreateDocumentDialog";
import { Link } from "wouter";
import { 
  FileText, Calendar, MoreVertical, Trash2, 
  ExternalLink, Search
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function Home() {
  const { data: documents, isLoading } = useDocuments();
  const deleteDocument = useDeleteDocument();
  const [search, setSearch] = useState("");

  const filteredDocs = documents?.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border/50 sticky top-0 z-10 backdrop-blur-xl bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Lumina Editor
              </h1>
              <p className="text-xs text-muted-foreground">Premium Document Processor</p>
            </div>
          </div>
          <CreateDocumentDialog />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search documents..." 
              className="pl-10 h-12 rounded-xl bg-background shadow-sm border-border/50 hover:border-primary/50 focus:border-primary transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredDocs?.length || 0} Documents
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm space-y-4">
                <Skeleton className="h-4 w-1/3 rounded-lg" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-3 w-1/4 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))
          ) : filteredDocs && filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div 
                key={doc.id} 
                className="group relative bg-card hover:bg-card/50 rounded-2xl border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col"
              >
                {/* Card Preview Area */}
                <Link href={`/document/${doc.id}`} className="block flex-1 p-6 cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary/5 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    {/* Date Badge */}
                    <div className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(doc.updatedAt || doc.createdAt!), { addSuffix: true })}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {/* Attempt to extract text content from JSON or show placeholder */}
                    {(doc.content as any)?.content?.[0]?.content?.[0]?.text || "No preview available..."}
                  </p>
                </Link>

                {/* Card Actions Footer */}
                <div className="px-6 py-4 border-t border-border/50 flex justify-between items-center bg-muted/20 rounded-b-2xl">
                  <Link href={`/document/${doc.id}`} className="text-sm font-medium text-primary flex items-center gap-1 hover:underline">
                    Open <ExternalLink className="h-3 w-3" />
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background/80">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuItem asChild>
                         <Link href={`/document/${doc.id}`} className="cursor-pointer">Edit Document</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this document?")) {
                            deleteDocument.mutate(doc.id);
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-muted p-6 rounded-full mb-6">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No documents yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Create your first document to get started with the Lumina Editor experience.
              </p>
              <CreateDocumentDialog />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
