import { tg } from "../instance";

(async () => {
  await tg.client.connect();
  //   await tg.sendCode("+13603407608");
  //   await tg.client.disconnect();

  console.log(await tg.login("+13603407608", "22479"));

  tg.client.disconnect();
})();
