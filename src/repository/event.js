const uuid = require('uuid');
const {
  getChildLogger,
} = require('../core/logging');
const {
  getKnex,
  tables,
} = require('../data');
const reminderService = require('../service/reminder');

const SELECT_COLUMNS = [
  /*Event */
  `${tables.event}.id AS eventId`,
  `${tables.event}.title AS eventNaam`,
  `${tables.event}.description AS eventBeschrijving`,
  `${tables.event}.date AS eventDatum`,
  'type',
  /*User */
  `${tables.user}.id AS userId`,
  `${tables.user}.name AS userNaam`,
];

const formatEvent = ({
  eventId,
  eventNaam,
  eventBeschrijving,
  eventDatum,
  type,
  userId,
  userNaam,
  ...rest
}) => ({
  ...rest,

  event: {
    id: eventId,
    title: eventNaam,
    description: eventBeschrijving,
    date: eventDatum,
    type: type,
  },
  user: {
    id: userId,
    name: userNaam,
  },
});

const findAll = async ({
  limit,
  offset,
}) => {
  const events = await getKnex()(tables.event)
    .select(SELECT_COLUMNS)
    .join(tables.user, `${tables.event}.userId`, '=', `${tables.user}.id`)
    .limit(limit)
    .offset(offset)
    .orderBy(`${tables.event}.date`, 'ASC');

  return events.map(formatEvent);
};

const findCount = async () => {
  const [count] = await getKnex()(tables.event).count();

  return count['count(*)'];
};

const findById = async (id) => {
  const event = await getKnex()(tables.event)
    .first(SELECT_COLUMNS)
    .join(tables.user, `${tables.event}.userId`, '=', `${tables.user}.id`)
    .where(`${tables.event}.id`, id);

  return event && formatEvent(event);
};

const create = async ({
  userId,
  title,
  description,
  date,
  type,
}) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.event).insert({
      id,
      userId,
      title,
      description,
      date,
      type,
    });
    await reminderService.create({
      eventId: id,
      description: `${title} begint zometeen`,
      date,
    });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('Eventrepository');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

const updateById = async (id, {
  userId,
  title,
  description,
  date,
  type,
}) => {
  try {
    await getKnex()(tables.event)
      .update({
        userId,
        title,
        description,
        date,
        type,
      })
      .where(`${tables.event}.id`, id);
      
    await reminderService.deleteByEventId(id);
    await reminderService.create({
      eventId: id,
      description,
      date,
    });
    
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('Eventrepository');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

const deleteById = async (id) => {
  try {    
    await reminderService.deleteByEventId(id);

    const rowsAffected = await getKnex()(tables.event)
      .delete()
      .where('id', id);

    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('Eventrepository');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findCount,
  findById,
  create,
  updateById,
  deleteById,
};
