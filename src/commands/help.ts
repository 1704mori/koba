import BaseCommand from "../abstracts/BaseCommand";
import Bot from "../bot";
import { Message, MessageEmbed } from "discord.js";

export default class Help extends BaseCommand {
  constructor() {
    super("help", "misc", [], true, "Shows help for a specific command", "<command>");
  }

  async execute(bot: Bot, message: Message, args: string[]): Promise<void> {
    const [command] = args;
    const { prefix } = await bot.dbFunctions.getGuild(message.guild);
    const embed = new MessageEmbed().setColor("#4ebffc")

    if (!command) {
      const commands = bot.commands.map((element) => {
        return `${prefix}${element.getName()} \n`;
      });

      embed.addField(
        "Available commands",
        `${commands.join(
          ""
        )}\nIf you need more information about a specific command, use \`${prefix}help <command>\``
      );

      message.channel.send({ embeds: [embed] });
      return;
    }

    const lowerCaseCommand = command.toLowerCase();
    const commandToExecute = bot.commands.find(
      (element) => element.getName() === lowerCaseCommand
    );
    
    if (!commandToExecute) {
      embed.setDescription(
        `Command \`${command}\` not found. Use \`${prefix}help\` to see all available commands.`
      );
      message.channel.send({ embeds: [embed] });
      return;
    }

    embed.setTitle(`Help for command \`${commandToExecute.getName()}\``)
      .setDescription(commandToExecute.getDescription())
      .addField("Usage", `\`${prefix}${commandToExecute.getName()} ${commandToExecute.getUsage()}\``);

    message.channel.send({ embeds: [embed] });
  }
}
