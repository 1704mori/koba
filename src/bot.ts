import BaseCommand from "./abstracts/BaseCommand";
import BaseEvent from "./abstracts/BaseEvent";
import { UtilFunctions } from "./utils/UtilFunctions";
import { Client, Collection, Intents } from "discord.js";

export default class Bot extends Client {
  private static instance: Bot;
  public client: Client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
  });

  private _events = new Collection<string, BaseEvent>();
  private _commands = new Collection<string, BaseCommand>();
  private _utilFunctions = new UtilFunctions();

  get events(): Collection<string, BaseEvent> {
    return this._events;
  }

  get commands(): Collection<string, BaseCommand> {
    return this._commands;
  }

  get utilFunctions(): UtilFunctions {
    return this._utilFunctions;
  }

  static getInstance(): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot({
        intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
      });
    }

    return Bot.instance;
  }
}
