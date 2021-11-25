import BaseEvent from "../abstracts/BaseEvent";
import Bot from "../bot";
import Discord, { GuildMember } from "discord.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default class GuildMemberRemove extends BaseEvent {
  constructor() {
    super("guildMemberRemove");
  }

  async execute(bot: Bot, member: GuildMember) {
    const { general_log_channel } = await bot.dbFunctions.getGuild(member.guild);

    console.log(general_log_channel)
    if (!general_log_channel) return;


    const logChannel = bot.channels.cache.get(general_log_channel) as Discord.TextChannel;
    const usernameWithTag = `${member.user.username}#${member.user.discriminator}`;

    console.log(member.roles.cache.map((r) => `<@&${r.name}>`));
    const currentGuild = bot.guilds.cache.get(member.guild.id);
    const everyoneRole = currentGuild.roles.cache.find((f) => f.name === "@everyone");

    const removeEveryone = member.roles.cache
      .filter((f) => f.id !== everyoneRole.id)
      .map((r) => `<@&${r.id}>`);

    const logEmbed = new Discord.MessageEmbed()
      .setColor("#d32f2f")
      .setAuthor(`${usernameWithTag} - User Left`, member.user.displayAvatarURL())
      .addField("• Profile:", 'member.user as any', false)
      .addField(
        "• Joined at:",
        dayjs(member.joinedTimestamp as number)
          .tz("Asia/Tokyo")
          .format("YYYY/MM/DD HH:mm:ss"),
        false
      )
      .addField("• Left at:", dayjs().tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss"), false);

    if (removeEveryone.length) {
      // logEmbed.addField("• Roles:", removeEveryone as any, true);
    }
    
    logEmbed.setFooter(`ID: ${member.id}`).setTimestamp();

    logChannel.send({
      embeds: [logEmbed],
    });
  }
}
