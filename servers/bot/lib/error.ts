import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

export const catchRuntimeError =
  <
    Fn extends <T extends FastifyRequest<any>, U extends FastifyReply<any>>(
      request: T,
      reply: U
    ) => Promise<any>
  >(
    fn: Fn
  ) =>
  (request: FastifyRequest, reply: FastifyReply) =>
    fn(request, reply).catch((error) => {
      if (error instanceof ZodError)
        return reply.status(400).send(error.format());
      return reply.status(500).send(error);
    });
