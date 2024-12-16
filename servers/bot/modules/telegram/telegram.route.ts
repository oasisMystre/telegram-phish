import { FastifyRequest } from "fastify";

import { db } from "../../db";
import { createTgClient, tg } from "../../instance";
import {
  createOrUpdateAccount,
  getAccountByPhoneNumber,
} from "../account/account.controller";

import { telegramSchema } from "./telegram.schema";

export const loginRoute = async (
  request: FastifyRequest<{ Body: Zod.infer<typeof telegramSchema> }>
) => {
  return telegramSchema
    .omit({ phoneCode: true })
    .parseAsync(request.body)
    .then(async (body) => {
      const tg = createTgClient();
      await tg.client.connect();
      const data = await tg.sendCode(body.phoneNumber);
      const session = tg.session.save();
      console.log(session)

      await createOrUpdateAccount(db, { ...body, session });

      return { ...data, session };
    });
};

export const verifyRoute = async (
  request: FastifyRequest<{ Body: Zod.infer<typeof telegramSchema> }>
) => {
  return telegramSchema.parseAsync(request.body).then(async (body) => {
    const { phoneNumber, password, phoneCode } = body;
    const [account] = await getAccountByPhoneNumber(db, phoneNumber);
    const tg = createTgClient(account.session);
    await tg.client.connect();

    await tg.login(phoneNumber, phoneCode);
    const session = tg.session.save();
    await createOrUpdateAccount(db, { phoneNumber, password, session });

    return { session };
  });
};
