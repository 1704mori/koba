import Bot from "../bot";
import { promises as fs } from "fs";
import * as path from "path";

class CommandHandler {
  async execute(bot: Bot, dir: string) {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);

    try {
      for (const file of files) {
        if (file.endsWith(".ts") || file.endsWith(".js")) {
          const { default: Command } = await import(path.resolve(__dirname, dir, file));
          const command = new Command();

          bot.commands.set(command.getName(), command);
          command.getAliases().forEach((alias: string) => {
            bot.commands.set(alias, command);
          });
          console.log(`Command ${command.getName()} loaded.`);
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default CommandHandler;
