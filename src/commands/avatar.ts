import BaseCommand from "../abstracts/BaseCommand";
import Bot from "../bot";
import { Message } from "discord.js";

export default class AvatarCommand extends BaseCommand {
  constructor() {
    super("avatar", "misc", [], true);
  }

  async execute(bot: Bot, message: Message, args: string[]): Promise<void> {
    const [original] = args;

    function returnUserAvatar() {
      if (message.mentions.members.first()) {
        if (message.content.includes("original")) {
          return message.mentions.users.first().displayAvatarURL({
            dynamic: true,
          });
        }

        return message.mentions.members.first().displayAvatarURL({
          dynamic: true,
        });
      }

      if (original) {
        return message.author.displayAvatarURL({
          dynamic: true,
        });
      }

      return message.member.displayAvatarURL({
        dynamic: true,
      });
    }

    message.channel.send(returnUserAvatar());
  }
}
