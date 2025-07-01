import {
  boolean,
  date,
  datetime,
  decimal,
  float,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  time,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

// UserDetails Table
// export const USERS = mysqlTable("users", {
//   id: int("id").primaryKey().autoincrement(),
//   email: varchar("email", {lenght: 255}).notNull().unique(),
//   username: varchar("username", { length: 255 }).notNull(),
//   password: varchar("password", { length: 255 }).notNull(),
//   created_at: timestamp("created_at").defaultNow(),
//   updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
// });

export const USERS = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(), // Frontend-generated UUID
  created_at: timestamp("created_at").defaultNow(),
});

export const LEGAL_QUERIES = mysqlTable("legal_queries", {
  id: int("id").primaryKey().autoincrement(),
  user_id: varchar("user_id", { length: 64 }).notNull().references(() => USERS.id),
  original_issue: text("original_issue").notNull(),
  issue_summary: text("issue_summary"),
  applicable_laws: text("applicable_laws"),
  user_rights: text("user_rights"),
  violations_detected: text("violations_detected"),
  step_by_step_actions: json("step_by_step_actions"),
  legal_authorities_to_contact: text("legal_authorities_to_contact"),
  documents_required: json("documents_required"),
  time_limits: text("time_limits"),
  recommended_legal_professionals: json("recommended_legal_professionals"),
  risks_and_warnings: text("risks_and_warnings"),
  // similar_past_cases: json("similar_past_cases"),
  notes_and_advice: text("notes_and_advice"),
  law_reference_source: text("law_reference_source"),
  created_at: timestamp("created_at").defaultNow(),
});