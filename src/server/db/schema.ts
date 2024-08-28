import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
export const createTable = sqliteTableCreator((name) => `t3_${name}`);

export const todos = createTable(
  "todo",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title", { length: 256 }).notNull(),
    description: text("description", { length: 1024 }).notNull(),
    dueDate: int("due_date", { mode: "timestamp" }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    titleIndex: index("title_idx").on(example.title),
    dueDateIndex: index("due_date_idx").on(example.dueDate),
  })
);
