import { object, string } from "zod";

export const telegramSchema = object({
  phoneNumber: string()
    .trim()
    .transform((value) => value.replace(/\s+/g, "")),
  password: string(),
  phoneCode: string(),
});
