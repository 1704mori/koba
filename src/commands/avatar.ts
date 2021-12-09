import BaseCommand from "../abstracts/BaseCommand";
import Bot from "../bot";
import { ImageURLOptions, Message } from "discord.js";

export default class AvatarCommand extends BaseCommand {
  constructor() {
    super("avatar", "misc", [], true, "Shows the avatar of a specified user", "[user] [original]");
  }

  async execute(bot: Bot, message: Message, args: string[]): Promise<void> {
    const [original] = args;

    const options: ImageURLOptions = {
      dynamic: true,
      size: 4096,
    };

    function returnUserAvatar() {
      if (message.mentions.members.first()) {
        if (message.content.includes("original")) {
          return message.mentions.users.first().displayAvatarURL(options);
        }

        return message.mentions.members.first().displayAvatarURL(options);
      }

      if (original) {
        return message.author.displayAvatarURL(options);
      }

      return message.member.displayAvatarURL(options);
    }

    message.channel.send(returnUserAvatar());
  }
}
