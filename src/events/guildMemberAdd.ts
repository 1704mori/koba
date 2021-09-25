import BaseEvent from "../abstracts/BaseEvent";
import Bot from "../bot";
import Discord, { GuildMember } from "discord.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default class GuildMemberAdd extends BaseEvent {
  constructor() {
    super("guildMemberAdd");
  }

  async execute(bot: Bot, member: GuildMember) {
    const { generalLogChannel } = await bot.utilFunctions.getGuild(member.guild);

    if (!generalLogChannel) return;

    const logChannel = bot.channels.cache.get(generalLogChannel) as Discord.TextChannel;
    const usernameWithTag = `${member.user.username}#${member.user.discriminator}`;

    const logEmbed = new Discord.MessageEmbed()
      .setColor("#388e3c")
      .setAuthor(`${usernameWithTag} - User Joined`, member.user.displayAvatarURL())
      .addField("• Profile:", member.user, false)
      .addField(
        "• Created at:",
        dayjs(member.user.createdAt).tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss"),
        false
      )
      .addField("• Joined at:", dayjs().tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss"), false)
      .setFooter(`ID: ${member.id}`)
      .setTimestamp();

    logChannel.send(logEmbed);
  }
}
