import { object, string } from "zod";

export const telegramSchema = object({
    phoneNumber: string().trim(),
    password: string(),
    phoneCode: string()
})