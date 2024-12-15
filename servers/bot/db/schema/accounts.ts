import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const accounts = pgTable("account", {
  id: uuid().defaultRandom().primaryKey(),
  phoneNumber: text().notNull().unique(),
  password: text().notNull(),
  session: text().notNull(),
});
