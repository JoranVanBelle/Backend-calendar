const config = require('config');
const { getChildLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');
const eventRepository = require('../repository/event');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('event-service');
  this.logger.debug(message, meta);
};

const getAll = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET,
) => {
  debugLog('Fetching all events', { limit, offset });
  const data = await eventRepository.findAll({ limit, offset });
  const count = await eventRepository.findCount();
  return { data, count, limit, offset };
};


const getById = async (id) => {
  debugLog(`Fetching event with id ${id}`);
  const event = await eventRepository.findById(id);

  if (!event) {
    throw ServiceError.notFound(`There is no event with id ${id}`, {id});
  }

  return event;
};

const create = async ({ userId, title, description, date, type }) => {
  debugLog('Nieuw event creëren', { userId, title, description, date, type });
  return eventRepository.create({ userId, title, description, date, type });
};

const updateById = async (
  id,
  { userId, title, description, date, type },
) => {
  debugLog(`Event met id ${id} updaten`, {
    userId,
    title,
    description,
    date,
    type,
  });
  return eventRepository.updateById(id, {
    userId,
    title,
    description,
    date,
    type,
  });
};

const deleteById = async (id) => {
  debugLog(`Event met id ${id} verwijderen`);
  await eventRepository.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
