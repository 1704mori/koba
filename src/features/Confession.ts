import Bot from "../bot";
import * as Discord from "discord.js";

export default class Confession {
  static lastMessage = new Set();
  static selectingServer = new Set();
  static guilds: {
    [key: string]: {
      [key: string]: {
        guildId: string;
      };
    };
  } = {};

  static messageToSend: {
    [key: string]: {
      messageToSend: string;
    };
  } = {};

  static linkify(inputText: string) {
    let replacedText = "";

    let replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, "********");

    let replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, "********");

    let replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, "********");

    return replacedText;
  }

  static reset(message: Discord.Message) {
    this.selectingServer.delete(message.author.id);
    delete this.guilds[message.author.id];
    delete this.messageToSend[message.author.id];
  }

  static async execute(bot: Bot, message: Discord.Message) {
    if (message.author.bot) return;

    if (this.lastMessage.has(message.author.id)) {
      message.channel.send("You're send too much confessions, wait a moment.");
    }

    if (!this.messageToSend[message.author.id]) {
      this.messageToSend[message.author.id] = {
        messageToSend: message.content,
      };
    }

    if (!this.guilds[message.author.id] && !this.lastMessage.has(message.author.id)) {
      console.log("this.selectingServer.add(message.author.id);");

      const mutualGuilds = Promise.all(
        bot.guilds.cache.map(async (guild) => [
          guild.id,
          await guild.members.fetch(message.author).catch(() => null),
        ])
      ).then((guilds) => guilds.filter((g) => g[1]).map((guild) => bot.guilds.resolve(guild[0])));

      const resolvedGuilds = await mutualGuilds;

      if (!this.selectingServer.has(message.author.id)) {
        message.channel.send("Select which server you'd like to send your confession to");
        for (let [index, guild] of resolvedGuilds.entries()) {
          index = index + 1;
          if (
            Object.keys(this.guilds).length &&
            this.guilds[message.author.id] &&
            this.guilds[message.author.id][index]
          ) {
            continue;
          }

          this.guilds[message.author.id] = {
            ...this.guilds[message.author.id],
            [index]: {
              guildId: guild.id,
            },
          };

          message.channel.send(`**${index}** - \`${guild.name}\``);
        }
      }

      this.selectingServer.add(message.author.id);
    }

    if (
      this.selectingServer.has(message.author.id) &&
      this.guilds[message.author.id][message.content] &&
      !this.lastMessage.has(message.author.id)
    ) {
      const selectedGuild = bot.guilds.cache.get(this.guilds[message.author.id][message.content].guildId);
      const guildData = await bot.utilFunctions.getGuild(selectedGuild);

      const channel = bot.channels.cache.get(guildData.confessionChannel) as Discord.TextChannel;
      const logChannel = bot.channels.cache.get(guildData.confessionLogChannel) as Discord.TextChannel;

      if (this.messageToSend[message.author.id].messageToSend.length <= 5) {
        message.author.send("Confession too short.");
        this.lastMessage.delete(message.author.id);
        this.reset(message);
        return;
      }

      if (!channel) return;

      const embed = new Discord.MessageEmbed()
        .setAuthor("Confession", "https://i.imgur.com/hGloDh4.png")
        .setColor(0x000000)
        .setDescription(`${this.linkify(this.messageToSend[message.author.id].messageToSend)}`)
        .setTimestamp();

      const logEmbed = new Discord.MessageEmbed()
        .setAuthor("Confession - Log", "https://i.imgur.com/hGloDh4.png")
        .setColor(0x000000)
        .addField("Author", `${message.author.username} (${message.author.tag})`)
        .addField("Message", `${this.messageToSend[message.author.id].messageToSend}`)
        .setTimestamp();

      channel.send(embed);
      if (logChannel) {
        logChannel.send(logEmbed);
      }

      this.reset(message);

      this.lastMessage.add(message.author.id);
    }

    setTimeout(() => {
      this.lastMessage.delete(message.author.id);
    }, 300000);
  }
}
