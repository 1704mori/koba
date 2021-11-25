import BaseCommand from "../abstracts/BaseCommand";
import Bot from "../bot";
import { Message, TextChannel } from "discord.js";

export default class SayCommand extends BaseCommand {
  constructor() {
    super("say", "moderation", [], true);
  }

  async execute(client: Bot, message: Message, args: string[]): Promise<void> {
    const channelId = args[1] && args[1].replace(/\D/g, "");

    if (channelId && args[0]) {
      const channel = client.channels.cache.get(channelId) as TextChannel;
      channel.send(args[0]);
      message.delete();

      return;
    }

    message.channel.send(args[0]);
    message.delete();
  }
}
