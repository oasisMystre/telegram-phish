import type { FastifyReply, FastifyRequest } from "fastify";

import { db } from "../../db";
import { insertAccountSchema } from "../../db/zod";
import { createOrUpdateAccount } from "./account.controller";

export const createAccountRoute = (
  request: FastifyRequest<{ Body: Zod.infer<typeof insertAccountSchema> }>,
  reply: FastifyReply
) =>
  insertAccountSchema.parseAsync(request.body).then(async (body) => {
    const [account] = await createOrUpdateAccount(db, body);
    if (account) {
      return account;
    }

    return reply
      .status(404)
      .send({ message: "account not updated or created" });
  });
