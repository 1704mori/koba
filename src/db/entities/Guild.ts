import { Model } from "objection";
import { v4 } from "uuid";

export default class Guild extends Model {
  public id: string;
  public guild_id: string;
  public guild_name: string;
  public prefix: string;
  public general_log_channel: string;
  public confession_log_channel: string;
  public confession_channel: string;
  public created_at: Date;
  public updated_at: Date;

  static tableName = "guilds";

  $beforeInsert() {
    this.id = v4();
    this.created_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}
