const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.reminder).delete();

    await knex(tables.reminder).insert([
      // 1, "Backend creëren start binnenkort", "2021-12-08 11:30:00.000"
      {
        id: '1',
        eventId: '7f28c5f9-d711-4cd6-ac15-d13d71abff01',
        description: 'Backend creëren start binnenkort',
        date: '2021-12-08 11:30:00.000',
      },
      {
        id: '2',
        eventId: '7f28c5f9-d711-4cd6-ac15-d13d71abff02',
        description: 'Backend testen start binnenkort',
        date: '2021-12-09 11:30:00.000',
      },
      {
        id: '3',
        eventId: '7f28c5f9-d711-4cd6-ac15-d13d71abff03',
        description: 'Hardlopen start binnenkort',
        date: '2021-12-10 11:30:00.000',
      },
    ]);
  },
};
