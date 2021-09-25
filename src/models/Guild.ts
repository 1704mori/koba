import { IGuild } from "../interfaces/IGuild";
import mongoose, { Schema, Document } from "mongoose";

const GuildSchema = new Schema(
  {
    guildId: String,
    guildName: String,
    prefix: String,
    generalLogChannel: String,
    confessionLogChannel: String,
    confessionChannel: String,
  },
  { timestamps: true }
);

export type GuildDocument = IGuild & Document;

export const GuildModel = mongoose.model<GuildDocument>("Guilds", GuildSchema);
