import BaseEvent from "../abstracts/BaseEvent";
import Bot from "../bot";
import Discord from "discord.js";

export default class MessageDelete extends BaseEvent {
  constructor() {
    super("messageDelete");
  }

  async execute(bot: Bot, message: Discord.Message) {
    if (message.author && message.author.bot) {
      return;
    }

    const { generalLogChannel } = await bot.utilFunctions.getGuild(message.guild);

    if (!generalLogChannel) {
      return;
    }

    const logChannel = bot.channels.cache.get(generalLogChannel) as Discord.TextChannel;

    const messageHadAttachment = message.attachments.first();

    const logEmbed = new Discord.MessageEmbed()
      .setColor(0xe91e63)
      .setAuthor("Deleted message", `${message.author.displayAvatarURL()}`);

    if (message.content) logEmbed.addField("Message", `${message.content}`);
    if (messageHadAttachment)
      ["jpg", "png", "jpeg", "webp", "gif"].includes(messageHadAttachment.proxyURL.split(".").pop() as string)
        ? logEmbed.setImage(messageHadAttachment.proxyURL)
        : logEmbed.setDescription(messageHadAttachment.proxyURL);

    logEmbed.addField("Author", `${message.author} (${message.author.tag})`);
    logEmbed.addField("Channel", `${message.channel} (${message.channel.id})`);
    logEmbed.setFooter(`Auhtor: ${message.author.id} | ID da Mensagem: ${message.id}`).setTimestamp();

    logChannel.send(logEmbed);
  }
}
