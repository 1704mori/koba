import BaseEvent from "../abstracts/BaseEvent";
import Bot from "../bot";
import Discord from "discord.js";
import Confession from "../features/Confession";

export default class MessageCreate extends BaseEvent {
  constructor() {
    super("messageCreate");
  }

  async execute(bot: Bot, message: Discord.Message) {
    if (message.channel.type == "DM") {
      Confession.execute(bot, message);
      return
    }

    if (message.author.bot) return;

    const guildData = await bot.dbFunctions.getGuild(message.guild);
    if (message.content.indexOf(guildData.prefix) !== 0) return;

    // remove the comment below in case you need the bot to only work in a specific channel
    // if (message.channel.id != "123123123123123") return;

    const [cmdName, ...cmdArgs] = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
    const command = bot.commands.get(cmdName.toLowerCase());

    if (command) {
      command.execute(bot, message, cmdArgs);
    }
  }
}
