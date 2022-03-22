import Discord from "discord.js";
import Bot from "./modules/bot/bot";
import Server from "./modules/webserver/server";
import config from "./config.json";
import auth from "./auth.json";

const Client = new Discord.Client({
  intents: ["GUILDS"],
});

Client.login(auth.BOT_TOKEN);

const BotInstance = new Bot(Client);
const ServerInstance = new Server(config.PORT);

ServerInstance.start();
