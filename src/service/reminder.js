const config = require('config');
const {
  getChildLogger,
} = require('../core/logging');
const reminderRepository = require('../repository/reminder');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('reminder-service');
  this.logger.debug(message, meta);
};

const getAll = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET,
) => {
  debugLog('Fetching all reminders');
  const data = await reminderRepository.findAll({
    limit,
    offset,
  });
  const count = await reminderRepository.findCount();
  return {
    data,
    count,
    limit,
    offset,
  };
};

const getByEventId = async (id) => {
  debugLog(`Fetching reminder with id ${id}`);
  return reminderRepository.findByEventId(id);
};

const create = async ({
  eventId,
  description,
  date,
}) => {
  const newReminder = {
    eventId,
    description,
    date,
  };
  debugLog('Nieuwe reminder creëren', newReminder);
  return reminderRepository.create(newReminder);
};

const updateById = async (id, {
  eventId,
  description,
  date,
}) => {
  const updatedReminder = {
    eventId,
    description,
    date,
  };
  debugLog(`Reminder met met id ${id} bewerken`, updatedReminder);
  return reminderRepository.updateById(parseInt(id), updatedReminder);
};

const deleteById = async (id) => {
  debugLog(`Reminder met id ${id} verwijderen`);
  await reminderRepository.deleteById(id);
};

const deleteByEventId = async (id) => {
  debugLog(`Reminder met EventId ${id} verwijderen`);
  await reminderRepository.deleteByEventId(id);
};

module.exports = {
  getAll,
  getByEventId,
  create,
  updateById,
  deleteById,
  deleteByEventId,
};
