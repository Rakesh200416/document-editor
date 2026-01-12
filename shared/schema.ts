import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: blob("content", { mode: "json" }), // Stores Tiptap JSON content
  headerContent: text("header_content").default(""), // Stores header text
  footerContent: text("footer_content").default(""), // Stores footer text
  showPageNumbers: integer("show_page_numbers", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

// API Contract Types
export type CreateDocumentRequest = InsertDocument;
export type UpdateDocumentRequest = Partial<InsertDocument>;
export type DocumentResponse = Document;
export type DocumentsListResponse = Document[];
