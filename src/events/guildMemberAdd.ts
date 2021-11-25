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
    const { general_log_channel } = await bot.dbFunctions.getGuild(member.guild);

    console.log('join', general_log_channel)

    if (!general_log_channel) return;

    const logChannel = bot.channels.cache.get(general_log_channel) as Discord.TextChannel;
    const usernameWithTag = `${member.user.username}#${member.user.discriminator}`;

    const logEmbed = new Discord.MessageEmbed()
      .setColor("#388e3c")
      .setAuthor(`${usernameWithTag} - User Joined`, member.user.displayAvatarURL())
      .addField("• Profile:", 'member.user as any', false)
      .addField(
        "• Created at:",
        dayjs(member.user.createdAt).tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss"),
        false
      )
      .addField("• Joined at:", dayjs().tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss"), false)
      .setFooter(`ID: ${member.id}`)
      .setTimestamp();

    logChannel.send({
      embeds: [logEmbed],
    });
  }
}
