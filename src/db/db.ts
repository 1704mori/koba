import Knex from "knex";
import { Model } from "objection";

const knex = Knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "docker",
    database: "koba",
  },
});

Model.knex(knex);

async function createSchema() {
  if (await knex.schema.hasTable("guilds")) {
    return;
  }

  await knex.schema.createTable("guilds", (table) => {
    table.string("id").primary();
    table.string("guild_id");
    table.string("guild_name");
    table.string("prefix").defaultTo(">");
    table.string("general_log_channel");
    table.string("confession_log_channel");
    table.string("confession_channel");
    table.timestamps(true, true);
  });
}

createSchema().catch((err) => {
  console.error(err);
  return knex.destroy();
});
