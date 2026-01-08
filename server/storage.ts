import { db } from "./db";
import {
  documents,
  type InsertDocument,
  type UpdateDocumentRequest,
  type DocumentResponse,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getDocuments(): Promise<DocumentResponse[]>;
  getDocument(id: number): Promise<DocumentResponse | undefined>;
  createDocument(doc: InsertDocument): Promise<DocumentResponse>;
  updateDocument(id: number, updates: UpdateDocumentRequest): Promise<DocumentResponse>;
  deleteDocument(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getDocuments(): Promise<DocumentResponse[]> {
    return await db.select().from(documents).orderBy(desc(documents.updatedAt));
  }

  async getDocument(id: number): Promise<DocumentResponse | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }

  async createDocument(doc: InsertDocument): Promise<DocumentResponse> {
    const [newDoc] = await db.insert(documents).values(doc).returning();
    return newDoc;
  }

  async updateDocument(id: number, updates: UpdateDocumentRequest): Promise<DocumentResponse> {
    const [updatedDoc] = await db
      .update(documents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return updatedDoc;
  }

  async deleteDocument(id: number): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }
}

export const storage = new DatabaseStorage();
