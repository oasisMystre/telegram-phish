import { object, string } from "zod";

export const adminMessageSchema = object({
  message: string(),
});
