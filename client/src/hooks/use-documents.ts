import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertDocument, type DocumentResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// GET /api/documents - List all documents
export function useDocuments() {
  return useQuery({
    queryKey: [api.documents.list.path],
    queryFn: async () => {
      const res = await fetch(api.documents.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch documents");
      return api.documents.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/documents/:id - Get single document
export function useDocument(id: number | null) {
  return useQuery({
    queryKey: [api.documents.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.documents.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch document");
      
      return api.documents.get.responses[200].parse(await res.json());
    },
  });
}

// POST /api/documents - Create new document
export function useCreateDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: InsertDocument) => {
      const validated = api.documents.create.input.parse(data);
      const res = await fetch(api.documents.create.path, {
        method: api.documents.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.documents.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create document");
      }
      return api.documents.create.responses[201].parse(await res.json());
    },
    onSuccess: (newDoc) => {
      queryClient.invalidateQueries({ queryKey: [api.documents.list.path] });
      toast({
        title: "Document Created",
        description: `"${newDoc.title}" has been created successfully.`,
      });
      setLocation(`/document/${newDoc.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// PUT /api/documents/:id - Update document
export function useUpdateDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertDocument>) => {
      const validated = api.documents.update.input.parse(updates);
      const url = buildUrl(api.documents.update.path, { id });
      
      const res = await fetch(url, {
        method: api.documents.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.documents.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 404) throw new Error("Document not found");
        throw new Error("Failed to update document");
      }
      
      return api.documents.update.responses[200].parse(await res.json());
    },
    onSuccess: (updatedDoc) => {
      queryClient.setQueryData([api.documents.get.path, updatedDoc.id], updatedDoc);
      queryClient.invalidateQueries({ queryKey: [api.documents.list.path] });
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// DELETE /api/documents/:id - Delete document
export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.documents.delete.path, { id });
      const res = await fetch(url, {
        method: api.documents.delete.method,
        credentials: "include",
      });

      if (res.status === 404) throw new Error("Document not found");
      if (!res.ok) throw new Error("Failed to delete document");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.documents.list.path] });
      toast({
        title: "Deleted",
        description: "Document moved to trash.",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
