import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
});

export const audits = pgTable("audits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  contractSource: text("contract_source").notNull(),
  fileName: text("file_name"),
  status: text("status").notNull(),
  vulnerabilities: jsonb("vulnerabilities"),
  gasOptimizations: jsonb("gas_optimizations"),
  eigenlayerValidated: boolean("eigenlayer_validated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const verifiedContracts = pgTable("verified_contracts", {
  id: serial("id").primaryKey(),
  auditId: integer("audit_id").references(() => audits.id),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertAuditSchema = createInsertSchema(audits).omit({ 
  id: true,
  createdAt: true, 
  vulnerabilities: true,
  gasOptimizations: true,
  eigenlayerValidated: true
});
export const insertVerifiedContractSchema = createInsertSchema(verifiedContracts).omit({
  id: true,
  createdAt: true
});

export type User = typeof users.$inferSelect;
export type Audit = typeof audits.$inferSelect;
export type VerifiedContract = typeof verifiedContracts.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAudit = z.infer<typeof insertAuditSchema>;
export type InsertVerifiedContract = z.infer<typeof insertVerifiedContractSchema>;