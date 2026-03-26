import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roasts = pgTable("roasts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  code: text("code").notNull(),
  codeHash: text("code_hash").notNull().unique(),
  fixedCode: text("fixed_code"),
  language: varchar("language", { length: 50 }).notNull(),
  score: numeric("score").notNull(),
  summary: text("summary").notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roastIssues = pgTable("roast_issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  roastId: uuid("roast_id")
    .references(() => roasts.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  severity: varchar("severity", { length: 50 }),
  diffRemoved: text("diff_removed"),
  diffAdded: text("diff_added"),
});

export const rateLimits = pgTable("rate_limits", {
  ip: varchar("ip", { length: 45 }).primaryKey(),
  requests: integer("requests").notNull().default(1),
  resetAt: timestamp("reset_at").notNull(),
});

export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;

export type RoastIssue = typeof roastIssues.$inferSelect;
export type NewRoastIssue = typeof roastIssues.$inferInsert;
