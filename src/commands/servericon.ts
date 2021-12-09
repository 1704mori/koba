import BaseCommand from "../abstracts/BaseCommand";
import Bot from "../bot";
import { ImageURLOptions, Message } from "discord.js";

export default class ServerIcon extends BaseCommand {
  constructor() {
    super("servericon", "misc", [], true, "Shows server's current icon", "");
  }

  async execute(bot: Bot, message: Message, args: string[]): Promise<void> {
    message.channel.send(message.guild.iconURL({ dynamic: true, size: 2048 }));
  }
}
