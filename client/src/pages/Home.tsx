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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              DocuFlow
            </h1>
            <p className="text-sm text-slate-500 -mt-1">Professional Document Editor</p>
          </div>
        </div>
        <Button 
          onClick={handleCreate} 
          disabled={createMutation.isPending} 
          className="shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 h-11 px-6"
        >
          {createMutation.isPending ? "Creating..." : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              New Document
            </>
          )}
        </Button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Your Documents</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Create and manage professional documents with real-time pagination
          </p>
        </div>
        
        {/* How It Works Section */}
        <section className="mb-16 bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-blue-50">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h4 className="font-semibold text-lg text-slate-800 mb-2">Create Document</h4>
              <p className="text-slate-600">Click "New Document" to start creating your professional document with real-time pagination.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-indigo-50">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h4 className="font-semibold text-lg text-slate-800 mb-2">Edit Content</h4>
              <p className="text-slate-600">Type and format your content with our rich text editor. Watch pages update in real-time.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-50">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h4 className="font-semibold text-lg text-slate-800 mb-2">Print & Export</h4>
              <p className="text-slate-600">Add headers/footers and export to PDF or print with perfect page layouts.</p>
            </div>
          </div>
        </section>
        
        {/* Templates/Examples Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Sample Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Business Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Professional template for business reports with headers, footers, and page numbers.</p>
                <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100">
                  Use Template
                </Button>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Academic Paper
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Academic paper template with proper formatting, citations, and page breaks.</p>
                <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-100">
                  Use Template
                </Button>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-amber-600" />
                  Resume/CV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Professional resume template with clean formatting and proper spacing.</p>
                <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-100">
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Your Documents Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Your Documents</h3>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
               {[1,2,3].map(i => (
                 <div key={i} className="h-56 bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse" />
               ))}
            </div>
          ) : documents?.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No documents yet</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Create your first document to start writing with professional formatting and real-time pagination.
              </p>
              <Button 
                onClick={handleCreate} 
                variant="outline" 
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 h-12 px-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Document
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {documents?.map((doc) => (
                <Card key={doc.id} className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-slate-200 bg-white shadow-sm hover:shadow-md">
                  <CardHeader className="pb-3 pt-5 px-5">
                    <div className="flex justify-between items-start">
                      <CardTitle className="line-clamp-1 text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        <Link href={`/document/${doc.id}`}>{doc.title}</Link>
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-50">
                          <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => setDeleteId(doc.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="flex items-center text-sm mt-1.5 text-slate-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {doc.updatedAt && formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <Link href={`/document/${doc.id}`}>
                      <div className="h-36 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-4 overflow-hidden relative group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors">
                        <div className="w-full h-full text-sm text-slate-500 leading-relaxed select-none">
                          {'Document content preview...'}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/70 group-hover:from-blue-50/70 to-transparent h-12 top-auto bottom-0" />
                      </div>
                    </Link>
                  </CardContent>
                  <CardFooter className="pt-2 px-5 pb-5">
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 h-10" 
                      asChild
                    >
                      <Link href={`/document/${doc.id}`}>Open Document</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
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
