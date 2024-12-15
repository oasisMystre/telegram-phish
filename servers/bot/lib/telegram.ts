import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

export class Telegram {
  readonly session: StringSession;
  readonly client: TelegramClient;

  constructor(
    readonly apiId: number,
    readonly apiHash: string,
    session?: string,
    readonly connectionRetries?: number
  ) {
    this.session = new StringSession(session);
    this.client = new TelegramClient(this.session, apiId, apiHash, {
      connectionRetries,
    });
  }

  sendCode(phoneNumber: string) {
    return this.client.sendCode(
      { apiHash: this.apiHash, apiId: this.apiId },
      phoneNumber
    );
  }

  login(phoneNumber: string, phoneCode: string, password: string = "") {
    return new Promise((resolve, reject) =>
      resolve(
        this.client.start({
          phoneNumber: () => Promise.resolve(phoneNumber),
          password: () => Promise.resolve(password),
          phoneCode: () => Promise.resolve(phoneCode),
          onError: reject,
        })
      )
    );
  }
}
