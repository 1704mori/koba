import BaseCommand from "./abstracts/BaseCommand";
import BaseEvent from "./abstracts/BaseEvent";
import { Client, Collection, Intents } from "discord.js";
import { DBFunctions } from "./utils/DBFunctions";

export default class Bot extends Client {
  private static instance: Bot;
  public client: Client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
  });

  private _events = new Collection<string, BaseEvent>();
  private _commands = new Collection<string, BaseCommand>();
  private _dbFunctions = new DBFunctions();

  get events(): Collection<string, BaseEvent> {
    return this._events;
  }

  get commands(): Collection<string, BaseCommand> {
    return this._commands;
  }

  get dbFunctions(): DBFunctions {
    return this._dbFunctions;
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
