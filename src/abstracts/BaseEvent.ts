import Bot from "../bot";

export default abstract class BaseEvent {
  constructor(private name: string) {}

  getName(): string {
    return this.name;
  }
  abstract execute(bot: Bot, ...args: any): void;
}
