import { Message } from "discord.js";
import Bot from "../bot";

export default abstract class BaseCommand {
  constructor(
    private name: string,
    private category: string,
    private aliases: Array<string>,
    private hasArgs: boolean
  ) {}

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

  abstract execute(bot: Bot, message: Message, args: Array<string> | null): Promise<void>;
}
