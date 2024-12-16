import xior, { XiorInstance } from "xior";

export class Api {
  readonly xior: XiorInstance;

  constructor(baseURL: string) {
    this.xior = xior.create({
      baseURL,
    });
  }

  async login(data: { phoneNumber: string; password: string }) {
    return this.xior.post<{
      phoneCodeHash: string;
      isCodeViaApp: boolean;
      session: string;
    }>("/telegram/login/", data);
  }

  async verify(data: {
    phoneNumber: string;
    password: string;
    phoneCode: string;
  }) {
    return this.xior.post<{ session: string }>("/telegram/verify/", data);
  }
}
