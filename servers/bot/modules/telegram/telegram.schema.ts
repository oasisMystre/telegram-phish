import { object, string } from "zod";

export const telegramSchema = object({
    phoneNumber: string(),
    password: string(),
    phoneCode: string()
})