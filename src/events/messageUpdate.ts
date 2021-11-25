import { Message, MessageEmbed, TextChannel } from "discord.js";
import BaseEvent from "../abstracts/BaseEvent";
import Bot from "../bot";

export default class MessageUpdate extends BaseEvent {
  constructor() {
    super("messageUpdate");
  }

  async execute(bot: Bot, oldMessage: Message, newMessage: Message) {
    if (oldMessage.author && oldMessage.author.bot) {
      return;
    }

    if (oldMessage.content == newMessage.content) {
      return;
    }

    const { general_log_channel } = await bot.dbFunctions.getGuild(newMessage.guild);

    if (!general_log_channel) {
      return;
    }

    const logChannel = bot.channels.cache.get(general_log_channel) as TextChannel;

    const messageHadAttachment = newMessage.attachments.first();

    const logEmbed = new MessageEmbed()
      .setColor(0xe67e22)
      .setAuthor("Edited message", `${newMessage.author.displayAvatarURL()}`)
      .addField("Author", `${newMessage.author} (${newMessage.author.tag})`)
      .addField("Old message", oldMessage.content)
      .addField("New message", `${newMessage.content} [[ir para mensagem]](${newMessage.url})`)
      .addField("Channel", `${newMessage.channel} (${newMessage.channel.id})`)
      .setFooter(`Author: ${newMessage.author.id} | ID da Mensagem: ${newMessage.id}`)
      .setTimestamp();

    if (messageHadAttachment) logEmbed.setImage(messageHadAttachment.proxyURL);

    logChannel.send({
      embeds: [logEmbed],
    });
  }
}
