import { Guild } from "discord.js";
import { defaultSettings } from "../settings";
import { GuildDocument, GuildModel } from "../models/Guild";
import { IUpdateSettings } from "../interfaces/IUpdateSettings";

export class UtilFunctions {
  public async getGuild(guild: Guild): Promise<GuildDocument> {
    const data = await GuildModel.findOne({ guildId: guild.id });

    if (!data) return defaultSettings as any;

    return data;
  }

  public async listGuilds() {
    const guilds = await GuildModel.find();

    return guilds;
  }

  public async updateGuild(guild: Guild, settings: IUpdateSettings) {
    let data = await GuildModel.findOne({ guildId: guild.id });

    if (typeof data !== "object") data = null;

    if (!data) {
      const { id, name } = guild;

      Object.assign(settings, { guildId: id, guildName: name });

      await GuildModel.create(settings);

      console.log(`Guild ${guild.name} added settings: ${Object.keys(settings)}`);
      return;
    }

    if (data) {
      for (const key of Object.keys(settings)) {
        if (data[key] !== settings) data[key] = settings[key];
        else return;
      }
    }

    console.log(`Guild ${guild.name} updated settings: ${Object.keys(settings)}`);
    return await data.updateOne(settings);
  }
}
