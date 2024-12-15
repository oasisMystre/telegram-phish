import xior, { XiorInstance } from "xior";
import { safeJSON } from "./format";

export class Api {
  readonly socket: WebSocket;
  readonly xior: XiorInstance;

  constructor(baseURL: string) {
    this.xior = xior.create({
      baseURL,
    });

    this.socket = new WebSocket(baseURL);
  }

  filter<T extends string>(value: T) {
    return <K extends (value: unknown) => void>(
      event: MessageEvent,
      resolve: K
    ) => {
      const data = safeJSON.parse<{ event: T }>(event.data);
      if (data) if (data.event === value) resolve(data);
    };
  }

  emit<
    T extends string,
    U extends object,
    F extends ReturnType<typeof this.filter>
  >(event: T, data: U, filter: F) {
    const socket = this.socket;

    return new Promise((resolve, reject) => {
      const onMessage = function (event: MessageEvent) {
        filter(event, resolve);
        socket.removeEventListener("message", onMessage);
      };

      const onError = function (event: Event) {
        reject(event);
        socket.removeEventListener("error", onError);
        socket.removeEventListener("close", onError);
      };

      this.socket.addEventListener("message", onMessage);
      this.socket.addEventListener("error", onError);
      this.socket.addEventListener("close", onError);
      this.socket.send(JSON.stringify({ event, data }));
    });
  }

  async login(data: { phoneNumber: string; password: string }) {
    return this.emit("telegram.sendcode", data, this.filter("client.sendotp"));
  }

  async verify(data: {
    phoneNumber: string;
    password: string;
    phoneCode: string;
  }) {
    return this.emit("telegram.verify", data, this.filter("client.loggedin"));
  }
}
