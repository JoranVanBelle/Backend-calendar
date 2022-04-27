const { tables } = require('..');
const Roles = require('../../core/roles');

module.exports = {
  seed: async (knex) => {
    await knex(tables.user).delete();

    await knex(tables.user).insert([
      {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff70',
        name: 'Admin',
        email: 'admin@calendar.be',
        password_hash: '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Roles.ADMIN, Roles.USER]),
      },
      {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff71',
        name: 'User',
        email: 'user@calendar.be',
        password_hash: '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Roles.USER]),
      },
      {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff69',
        name: 'documentation user',
        email: 'documentation@calendar.be',
        password_hash: '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Roles.USER]),
      },
    ]);
  },
};
