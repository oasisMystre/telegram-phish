import { WebSocket } from "ws";

import { db } from "../../db";
import { Telegram } from "../../lib/telegram";
import { createTg } from "../../instance";
import { createOrUpdateAccount } from "../account/account.controller";

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
        password: string;
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

  socket.on("message", async (message) => {
    const event = safeJSON.parse<Event>(message.toString());
    if (event)
      switch (event.event) {
        case "telegram.sendcode":
          const data = await tg.sendCode(event.data.phoneNumber);
          console.log(data);
          socket.send(JSON.stringify({ event: "client.sendotp", data }));
          break;
        case "telegram.verify":
          const { phoneNumber, password, phoneCode } = event.data;
          await tg.login(phoneNumber, phoneCode);
          const session = tg.session.save();
          console.log(session);
          await createOrUpdateAccount(db, { phoneNumber, password, session });
          socket.send(JSON.stringify({ event: "client.loggedin", session }));
          tg.disconnect();
          break;
      }
  });

  socket.on("close", tg.disconnect);
};
