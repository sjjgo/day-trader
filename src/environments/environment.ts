import { env } from "../../client-settings.js";
export const environment = {
  production: false,
  number_of_players: env.NUMBER_PLAYERS,
  hostname: env.HOSTNAME,
  pusher_app_key: env.PUSHER_KEY,
};
