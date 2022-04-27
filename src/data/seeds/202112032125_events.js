const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.event).delete();

    await knex(tables.event).insert([
      {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff01',
        userId: '7f28c5f9-d711-4cd6-ac15-d13d71abff70',
        title: 'Backend creëren',
        description: '',
        date: '2021-12-09 12:00:00.000',
        type: 'School',
      },
      {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff02',
        userId: '7f28c5f9-d711-4cd6-ac15-d13d71abff70',
        title: 'Backend testen',
        description: 'Controleren of er een robuste api is ontwikkeld',
        date: '2021-12-07 15:00:00.000',
        type: 'School',
      },
      {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff03',
        userId: '7f28c5f9-d711-4cd6-ac15-d13d71abff71',
        title: 'Hardlopen',
        description: '',
        date: '2021-12-14 17:00:00.000',
        type: 'Vrije tijd',
      },
    ]);
  },
};
