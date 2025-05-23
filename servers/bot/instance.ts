import { Telegraf } from "telegraf";
import { Telegram } from "./lib/telegram";

export const bot = new Telegraf(process.env.TELEGRAF_ACCESS_TOKEN!);

export const createTgClient = (session?: string) =>
  new Telegram(
    Number(process.env.TELEGRAM_API_ID),
    process.env.TELEGRAM_API_HASH!,
    session,
    10000
  );
