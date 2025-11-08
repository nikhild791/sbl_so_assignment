import { pgTable, serial, text } from "drizzle-orm/pg-core";

    export const tasks = pgTable("tasks", {
      id :serial("id").primaryKey(),
      url: text("url").notNull(),
      question: text("question").notNull(),
      aiResponse: text("ai_response"),
      status: text("status").notNull().default("queued"),

    })