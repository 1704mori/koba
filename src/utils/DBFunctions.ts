import discord from 'discord.js';
import Guild from '../db/entities/Guild';
import { IUpdateSettings } from '../interfaces/IUpdateSettings';

export class DBFunctions {
  public async getGuild(guild: discord.Guild) {
    const data = await Guild.query().findOne({
      guild_id: guild.id,
    });

    return data;
  }

  public async createGuild(guild: discord.Guild) {
    await Guild.query().insert({
      guild_id: guild.id,
      guild_name: guild.name,
    });

    console.log(`Creating guild ${guild.name}`);
  }

  public async updateGuild(guild: discord.Guild, settings: IUpdateSettings) {
    const data = await Guild.query().findOne({
      guild_id: guild.id,
    });

    if (!data) {
      const { id, name } = guild;

      Object.assign(settings, { guild_id: id, guild_name: name });

      await Guild.query().insert(settings);

      console.log(`Added new settings ${Object.keys(settings)} to guild ${guild.name}`);
      return;
    }

    console.log(`Guild ${guild.name} updated settings: ${Object.keys(settings)}`);
    return await Guild.query().update(settings).where({ guild_id: guild.id });
  }
}
