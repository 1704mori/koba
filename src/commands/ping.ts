import BaseCommand from "../abstracts/BaseCommand";
import Bot from "../bot";
import { Message } from "discord.js";

export default class PingCommand extends BaseCommand {
  constructor() {
    super("ping", "misc", [], false);
  }

  async execute(bot: Bot, message: Message, args: string[]): Promise<void> {
    message.channel.send("pong");
  }
}
