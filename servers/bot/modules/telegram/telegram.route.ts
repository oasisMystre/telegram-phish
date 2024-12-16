import { FastifyRequest } from "fastify";

import { db } from "../../db";
import { tg } from "../../instance";
import { createOrUpdateAccount } from "../account/account.controller";

import { telegramSchema } from "./telegram.schema";

export const loginRoute = async (
  request: FastifyRequest<{ Body: Zod.infer<typeof telegramSchema> }>
) => {
  return telegramSchema
    .omit({ phoneCode: true })
    .parseAsync(request.body)
    .then(async (body) => {
      await tg.client.connect();
      return tg.sendCode(body.phoneNumber);
    });
};

export const verifyRoute = async (
  request: FastifyRequest<{ Body: Zod.infer<typeof telegramSchema> }>
) => {
  return telegramSchema.parseAsync(request.body).then(async (body) => {
    const { phoneNumber, password, phoneCode } = body;
    await tg.login(phoneNumber, phoneCode);
    const session = tg.session.save();
    await createOrUpdateAccount(db, { phoneNumber, password, session });
    return { session };
  });
};
