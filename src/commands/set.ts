import BaseCommand from "../abstracts/BaseCommand";
import Bot from "../bot";
import { Message } from "discord.js";

export default class SetCommand extends BaseCommand {
  constructor() {
    super("set", "moderation", [], true);
  }

  async execute(bot: Bot, message: Message, args: string[]): Promise<void> {
    const [set, type, channel] = args;

    const guild = await bot.utilFunctions.getGuild(message.guild);
    const sets = ["confession", "log"];
    const types = ["confession = channel", "log = general | confession"];

    if (!set || !sets.includes(set) || !channel) {
      message.channel.send(
        `Wrong syntax.\n **\`${guild.prefix}${this.getName()} <${sets.join("| ")}> <${types.join(" | ")}>\`**`
      );
      return;
    }

    if (set === "confession") {
      const data: any = {};
      bot.utilFunctions.updateGuild(message.guild, data);
      data[`${set}Channel`] = channel.replace(/\D/g, "");
      const channelId = channel.replace(/\D/g, "");

      message.channel.send(`**Confessions will now be sent to** <#${channelId}>`);
    }

    if (set === "log") {
      const data: any = {};
      bot.utilFunctions.updateGuild(message.guild, data);
      console.log(`${type}LogChannel`)
      data[`${type}LogChannel`] = channel.replace(/\D/g, "");
      const channelId = channel.replace(/\D/g, "");

      message.channel.send(`**${type} log will now be sent to** <#${channelId}>`);
    }
  }
}
