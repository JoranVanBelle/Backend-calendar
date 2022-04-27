const {shutdownData, getKnex, tables} = require('../src/data');

module.exports = async () => {
  await getKnex()(tables.event).delete();
  await getKnex()(tables.user).delete();
  await getKnex()(tables.reminder).delete();

  await shutdownData();
};