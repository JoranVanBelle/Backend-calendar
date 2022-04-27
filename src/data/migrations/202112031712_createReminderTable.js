const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.reminder, (table) => {
      table.increments('id').primary();
      table.uuid('eventId').notNullable();

      table
        .foreign('eventId', 'fk_reminder_event')
        .references(`${tables.event}.id`)
        .onDelete('CASCADE');

      table.string('description', 255);
      table.dateTime('date');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.reminder);
  },
};
