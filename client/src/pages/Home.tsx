import { useCreateDocument } from "@/hooks/use-documents";
import { DocumentList } from "@/components/DocumentList";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { mutate: createDocument, isPending } = useCreateDocument();

  const handleCreate = () => {
    createDocument({
      title: "Untitled Document",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Untitled Document" }]
          }
        ]
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-tr from-primary to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
              W
            </div>
            <h1 className="text-xl font-bold tracking-tight">WordSim</h1>
          </div>
          
          <Button 
            onClick={handleCreate}
            disabled={isPending}
            className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            {isPending ? (
              <span className="animate-pulse">Creating...</span>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> New Document
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">Your Documents</h2>
          <p className="text-muted-foreground text-lg">Manage and edit your latest work.</p>
        </div>

        <DocumentList />
      </main>
    </div>
  );
}
