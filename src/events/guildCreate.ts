import BaseEvent from "../abstracts/BaseEvent";
import Bot from "../bot";
import Discord from "discord.js";

export default class GuildCreate extends BaseEvent {
  constructor() {
    super("guildCreate");
  }

  async execute(bot: Bot, guild: Discord.Guild) {
    if (await bot.dbFunctions.getGuild(guild)) {
      return;
    }

    await bot.dbFunctions.createGuild(guild);
  }
}
