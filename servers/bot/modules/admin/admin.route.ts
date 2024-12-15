import { FastifyRequest } from "fastify";

import { bot } from "../../instance";
import { adminMessageSchema } from "./admin.schema";

export const adminMessageRoute = (
  request: FastifyRequest<{ Body: Zod.infer<typeof adminMessageSchema> }>
) =>
  adminMessageSchema.parseAsync(request.body).then(async (body) => {
    const userId = Number(process.env.USER_ID!);
    return bot.telegram.sendMessage(userId, body.message, {
      parse_mode: "MarkdownV2",
    });
  });
