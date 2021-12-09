import BaseCommand from "../abstracts/BaseCommand";
import Bot from "../bot";
import { ImageURLOptions, Message } from "discord.js";
import { REST } from "@discordjs/rest";
import axios from "axios";

export default class BannerCommand extends BaseCommand {
  constructor() {
    super("banner", "misc", [], true, "Shows the banner of a specified user", "[user] [original]");
  }

  async execute(bot: Bot, message: Message, args: string[]): Promise<void> {
    const [original] = args;

    const options: ImageURLOptions = {
      dynamic: true,
      size: 4096,
    };

    let isOriginal = false;

    if (message.content.includes("original")) {
      isOriginal = true;
    }

    function returnUserBanner() {
      if (message.mentions.members.first()) {

        return message.mentions.members.first().id;
      }

      return message.member.user.id;
    }

    const userBanner = await this.getUserBannerUrl(bot, isOriginal, message.guild.id, returnUserBanner(), {
      dynamicFormat: true,
      size: 4096,
    });

    if (!userBanner) {
      message.channel.send("Could not find a banner for that user.");
      return;
    }

    message.channel.send(userBanner);
  }

  private async getUserBannerUrl(
    bot: Bot,
    original: boolean,
    guildId: string,
    userId: string,
    { dynamicFormat = true, defaultFormat = "webp", size = 512 } = {}
  ) {
    if (![16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(size)) {
      throw new Error(`The size '${size}' is not supported!`);
    }

    if (!["webp", "png", "jpg", "jpeg"].includes(defaultFormat)) {
      throw new Error(`The format '${defaultFormat}' is not supported as a default format!`);
    }

    const rest = new REST().setToken(bot.token);
    // const endpoint = original ? `/users/${userId}` : `/users/${userId}/profile?with_mutual_guilds=false&guild_id=${guildId}`;

    const user = (await rest.get(`/users/${userId}`)) as any;
    if (!user.banner) return null;

    const query = `?size=${size}`;
    const baseUrl = `https://cdn.discordapp.com/banners/${userId}/${user.banner}`;

    if (dynamicFormat) {
      const { headers } = await axios.head(baseUrl);
      if (headers && headers.hasOwnProperty("content-type")) {
        return baseUrl + (headers["content-type"] == "image/gif" ? ".gif" : `.${defaultFormat}`) + query;
      }
    }

    return baseUrl + `.${defaultFormat}` + query;
  }
}
