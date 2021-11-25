import BaseCommand from "../abstracts/BaseCommand";
import Bot from "../bot";
import { Message } from "discord.js";

export default class PrefixCommand extends BaseCommand {
  constructor() {
    super("prefix", "moderation", [], true);
  }

  async execute(client: Bot, message: Message, args: string[]): Promise<void> {
    const prefix = args;

    if (prefix.length > 1) {
      message.channel.send("Invalid prefix");
      return;
    }

    try {
      await client.dbFunctions.updateGuild(message.guild, {
        prefix: prefix[0],
      });
      message.channel.send(`Prefix successfully updated to **${prefix[0]}**`);
    } catch (error) {
      console.log(error);
      message.channel.send(`Something went wrong, try again.`);
    }
  }
}
