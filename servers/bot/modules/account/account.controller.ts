import z from "zod";
import type { Database } from "../../db";
import { accounts } from "../../db/schema";
import { insertAccountSchema } from "../../db/zod";
import { eq } from "drizzle-orm";

export const createOrUpdateAccount = (
  database: Database,
  values: z.infer<typeof insertAccountSchema>
) =>
  database
    .insert(accounts)
    .values(values)
    .onConflictDoUpdate({
      target: [accounts.phoneNumber],
      set: values,
    })
    .returning()
    .execute();

export const getAccountByPhoneNumber = (
  database: Database,
  phoneNumber: string
) =>
  database
    .select()
    .from(accounts)
    .where(eq(accounts.phoneNumber, phoneNumber))
    .execute();
