import BaseCommand from "../abstracts/BaseCommand";
import Bot from "../bot";
import { Message } from "discord.js";

export default class SayCommand extends BaseCommand {
  constructor() {
    super("say", "moderation", [], true);
  }

  async execute(client: Bot, message: Message, args: string[]): Promise<void> {
    const say = args.join(" ");
    message.channel.send(say);
    message.delete();
    return;
  }
}
