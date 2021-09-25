import Bot from "../bot";
import { promises as fs } from "fs";
import * as path from "path";

class EventHandler {
  async execute(bot: Bot, dir: string) {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);

    try {
      for (const file of files) {
        if (file.endsWith(".ts") || file.endsWith(".js")) {
          const { default: Event } = await import(path.resolve(__dirname, dir, file));
          const event = new Event();

          bot.events.set(event.getName(), event);
          bot.on(event.getName(), event.execute.bind(event, bot));
          console.log(`Event ${event.getName()} loaded.`);
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default EventHandler;
