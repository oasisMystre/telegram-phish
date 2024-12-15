import validator from "validator";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { accounts } from "./schema";

export const insertAccountSchema = createInsertSchema(accounts, {
  phoneNumber: (column) => column.refine(validator.isMobilePhone),
}).omit({
  id: true,
});
export const selectAccountSchema = createSelectSchema(accounts);
