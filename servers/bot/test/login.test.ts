import { NewMessage } from "telegram/events";
import { tg } from "../instance";

(async () => {
  await tg.client.connect();
  //   await tg.sendCode("+13603407608");
  //   await tg.client.disconnect();
  tg.client.addEventHandler(
    (event) => console.log(event.message.text),
    new NewMessage({})
  );

  const name = await tg.client.getMessages('777000', {limit: 0})
  console.log(name.map(x => x.message))


  console.log("kskskskksksjsj")

  // console.log(await tg.login("+13603407608", "22479"));

  // tg.client.disconnect();
})();
