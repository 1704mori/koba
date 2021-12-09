import { Message } from "discord.js";
import Bot from "../bot";

export default abstract class BaseCommand {
  constructor(
    private name: string,
    private category: string,
    private aliases: Array<string>,
    private hasArgs: boolean,
    private description: string,
    private usage: string,
  )
   {}

  getName(): string {
    return this.name;
  }
  getCategory(): string {
    return this.category;
  }
  getAliases(): Array<string> {
    return this.aliases;
  }
  getArgs(): boolean {
    return this.hasArgs;
  }
  getDescription(): string {
    return this.description;
  }
  getUsage(): string {
    return this.usage;
  }

  abstract execute(bot: Bot, message: Message, args: Array<string> | null): Promise<void>;
}
