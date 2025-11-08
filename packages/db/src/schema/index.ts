import { pgTable, serial, text, timestamp,integer } from "drizzle-orm/pg-core";

    export const users = pgTable("users", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      email: text("email").notNull().unique(),
      createdAt: timestamp("created_at").defaultNow(),
    });

    export const tasks = pgTable("tasks", {
      id :serial("id").primaryKey(),
      url: text("url").notNull(),
      question: text("question").notNull(),
      aiResponse: text("ai_response"),
      userId : integer("user_id").notNull().references(()=>users.id),
      status: text("status").notNull().default("queued"),

    })