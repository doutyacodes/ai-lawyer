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
export const USERS = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// legal_queries.ts
export const LEGAL_QUERIES = mysqlTable("legal_queries", {
  id: int("id").primaryKey().autoincrement(),

  // Who asked
  user_id: int("user_id").notNull().references(() => USERS.id),

  // Optional user-defined title
  title: varchar("title", { length: 255 }),

  // User input (dynamic fields)
  country: varchar("country", { length: 100 }),
  state: varchar("state", { length: 100 }),
  locality: varchar("locality", { length: 150 }),
  incident_place: varchar("incident_place", { length: 255 }),  // optional
  age: int("age"),
  gender: varchar("gender", { length: 50 }),
  problem: text("problem").notNull(),

  // AI Response (entire response as JSON)
  response_json: json("response_json").notNull(),

  created_at: timestamp("created_at").defaultNow(),
});
