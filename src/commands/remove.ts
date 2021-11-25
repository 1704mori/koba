import BaseCommand from "../abstracts/BaseCommand";
import Bot from "../bot";
import { Message } from "discord.js";

export default class RemoveCommand extends BaseCommand {
  constructor() {
    super("remove", "moderation", [], true);
  }

  async execute(bot: Bot, message: Message, args: string[]): Promise<void> {
    const [set] = args;

    const guild = await bot.dbFunctions.getGuild(message.guild);
    const sets = ["confession", "log"];

    if (!set || !sets.includes(set)) {
      message.channel.send(`Wrong syntax.\n **\`${guild.prefix}${this.getName()} <${sets.join(" | ")}>\`**`);
      return;
    }

    if (set === "confession") {
      await bot.dbFunctions.updateGuild(message.guild, {
        confessionChannel: undefined,
      });

      message.channel.send(`**Confessions channel removed**`);
    }

    if (set === "log") {
      await bot.dbFunctions.updateGuild(message.guild, {
        generalLogChannel: undefined,
      });

      message.channel.send(`**Messages log removed**`);
    }
  }
}
