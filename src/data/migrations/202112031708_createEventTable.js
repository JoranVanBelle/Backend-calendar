const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.event, (table) => {
      table.uuid('id').primary();
      table.uuid('userId').notNullable();

      table
        .foreign('userId', 'fk_event_user')
        .references(`${tables.user}.id`)
        .onDelete('CASCADE');

      table.string('title', 255).notNullable();
      table.string('description', 255);
      table.dateTime('date');
      table.string('type', 255).notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.event);
  },
};
