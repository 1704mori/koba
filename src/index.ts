import "./db/db";
import Bot from "./bot";
import CommandHandler from "./handlers/CommandHandler";
import EventHandler from "./handlers/EventHandler";
import "dotenv/config";

const bot = Bot.getInstance();

(async () => {
  await new CommandHandler().execute(bot, "../commands");
  await new EventHandler().execute(bot, "../events");

  bot.login(process.env.BOT_TOKEN);
})();
