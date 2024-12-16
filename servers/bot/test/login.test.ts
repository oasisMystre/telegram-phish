import { NewMessage } from "telegram/events";
import { tg } from "../instance";

(async () => {
  await tg.client.connect();
  const data = await tg.sendCode("+2349076931902");
  console.log(tg.session.save())
  console.log(data);
})();

"1BAAOMTQ5LjE1NC4xNjcuOTEAUDrRTP5129b5HPPOX93p7xjIMI+0YG88Gp9+hXvoVo5ej5zGBCo+OzQVhr80diL/Q1I6i4tg2SiAuTajOEP2oFZT3gMXk7g7VMheCfry0Woaf5OO5LWTTv1MhHogGw58VbfZ4hmLDxhy8XLQBV15ijA8ATdOhxvv/x2Cmq+pjKhWPYeMOdvq0U4pzoC0peT5loINU0DcwgQyyGqpqndh1RCeYrDaFOte9LUM5wAq3V7d3+rgC0Be39u3aqXIKbERmLWWVZpYJ/kL/v2w/u9P1OR9o1Z+iOmn3Jx9Y8bS7o7nKFAv3aK2XrGd6OkHHN2F3ZQHx41Z6AmpjH6nZl1bxII="