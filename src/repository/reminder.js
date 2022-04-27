const {
  getChildLogger,
} = require('../core/logging');
const {
  getKnex,
  tables,
} = require('../data');

const SELECT_COLUMNS = [
  /*Reminder*/
  `${tables.reminder}.id as reminderId`,
  `${tables.reminder}.eventId as reminderEventId`,
  `${tables.reminder}.description AS reminderBeschrijving`,
  `${tables.reminder}.date As reminderDatum`,
  /*User */
  `${tables.user}.id AS userId`,
  `${tables.user}.name AS userNaam`,
];

const formatReminder = ({
  userId,
  userNaam,
  reminderId,
  reminderEventId,
  reminderBeschrijving,
  reminderDatum,
  ...rest
}) => ({
  ...rest,
  reminder: {
    id: reminderId,
    eventId: reminderEventId,
    description: reminderBeschrijving,
    date: reminderDatum,
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
  const reminders = await getKnex()(tables.reminder)
    .select(SELECT_COLUMNS)
    .join(tables.event, `${tables.reminder}.eventId`, '=', `${tables.event}.id`)
    .join(tables.user, `${tables.event}.userId`, '=', `${tables.user}.id`)
    .limit(limit)
    .offset(offset)
    .orderBy(`${tables.reminder}.id`, 'ASC');
    
  return reminders.map(formatReminder);
};

const findByEventId = (eventId) => {
  return getKnex()(tables.reminder).where('eventId', eventId);
};

const findCount = async () => {
  const [count] = await getKnex()(tables.reminder).count();
  return count['count(*)'];
};

const create = async ({
  eventId,
  description,
  date,
}) => {
  try {
    await getKnex()(tables.reminder).insert({
      eventId,
      description,
      date,
    });

  } catch (error) {
    const logger = getChildLogger('Reminderrepository');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

const findById = async (id) => {
  const reminder = await getKnex()(tables.reminder)
    .first(SELECT_COLUMNS)
    .join(tables.event, `${tables.event}.id`, '=', `${tables.reminder}.eventId`)
    .join(tables.user, `${tables.event}.userId`, '=', `${tables.user}.id`)
    .where(`${tables.reminder}.id`, id);

  return reminder && formatReminder(reminder);
};

const updateById = async (id, {
  eventId,
  description,
  date,
}) => {
  try {
    await getKnex()(tables.reminder)
      .update({
        eventId,
        description,
        date,
      })
      .where('id', id);

    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('Reminderrepository');
    logger.error('error in UpdateById', {
      error,
    });
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.reminder)
      .delete()
      .where('id', id);

    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('Reminderrepository');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

const deleteByEventId = async (eventId) => {
  try {
    const rowsAffected = await getKnex()(tables.reminder)
      .delete()
      .where('eventId', eventId);

    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('Reminderrepository');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findByEventId,
  findCount,
  create,
  updateById,
  deleteById,
  deleteByEventId,
};
