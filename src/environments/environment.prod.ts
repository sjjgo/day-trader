import { env_production } from "../../client-settings.js";
export const environment = {
  production: true,
  number_of_players: env_production.NUMBER_PLAYERS,
  hostname: env_production.HOSTNAME,
  pusher_app_key: env_production.PUSHER_KEY,
};
