const Joi = require('joi');
const Router = require('@koa/router');
const reminderService = require('../service/reminder');
const { requireAuthentication} = require('../core/auth');
const validate = require('./_validation');
/**
 * @swagger
 * tags:
 *   name: Reminders
 *   description: Represents a reminder from an event
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reminder:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *             - eventId
 *             - date
 *           properties:
 *             eventId:
 *               type: "string"
 *             description:
 *               type: "string"
 *             date:
 *               type: "string"
 *               format: date-time
 *           example:
 *             $ref: "#/components/examples/Reminder"
 *     ReminderAfterCreate:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *             - eventId
 *             - date
 *           properties:
 *             eventId:
 *               type: "string"
 *             description:
 *               type: "string"
 *             date:
 *               type: "string"
 *               format: date-time
 *           example:
 *             $ref: "#/components/examples/ReminderAfterCreate"
 *     RemindersList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Reminder"
 *     requestBodies:
 *       Register:
 *         description: The user info to register.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: documentation user2
 *                 email:
 *                   type: string
 *                   example: "documentation2@calendar.be"
 *                 password:
 *                   type: string
 *                   example: "0123456789"
 *   examples:
 *     Reminder:
 *       event:
 *         title: "Backend creëren"
 *       reminderId: 1
 *       reminderEventId: "7f28c5f9-d711-4cd6-ac15-d13d71abff83"
 *       reminderBeschrijving: "Backend creëren start binnenkort"
 *       reminderDatum: "2021-12-08T10:30:00.000Z"
 *       user:
 *         id: "7f28c5f9-d711-4cd6-ac15-d13d71abff70"
 *         name: "Joran Van Belle"
 *   requestBodies:
 *     Reminder:
 *       description: The reminder info to save
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 7f28c5f9-d711-4cd6-ac15-d13d71abff83
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: "date-time"
 *             required:
 *               - eventId
 *               - date
 */

/**
 * @swagger 
 * /api/reminders: 
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all reminders
 *     tags:
 *       - Reminders
 *     responses:
 *       200:
 *         description: List of reminders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RemindersList"
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const getAllReminders = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await reminderService.getAll(limit, offset);
};
getAllReminders.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().optional(),
    offset: Joi.number().min(0).integer().optional(),
  }).and('limit', 'offset'),
};

/**
 * @swagger
 * /api/reminders:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new reminder
 *     tags:
 *      - Reminders
 *     requestBody:
 *       $ref: "#/components/requestBodies/Reminder"
 *     responses:
 *       200:
 *         description: The created reminder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ReminderAfterCreate"
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const createReminder = async (ctx) => {
  const newReminder = await reminderService.create({
    ...ctx.request.body,
    userId: ctx.state.session.userId,
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newReminder;
  ctx.status = 201;
};
createReminder.validationScheme = {
  body: Joi.object({
    eventId: Joi.string().uuid(),
    description: Joi.string().allow(''),
    date: Joi.date().iso(),

  }),
};

/**
 * @swagger
 * /api/reminders/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a single reminder by eventId
 *     tags:
 *      - Reminders
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The reminders of the given event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Reminder"
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const getReminderByEventId = async (ctx) => {
  ctx.body = await reminderService.getByEventId(ctx.params.id);
};
getReminderByEventId.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
/**
 * @swagger
 * /api/reminders/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update an existing reminder
 *     tags:
 *      - Reminders
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/Reminder"
 *     responses:
 *       200:
 *         description: The updated reminder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Reminder"
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const updateReminder = async (ctx) => {
  ctx.body = await reminderService.updateById(ctx.params.id, {
    ...ctx.request.body,
    userId: ctx.state.session.userId,
    date: new Date(ctx.request.body.date),
  });
};
updateReminder.validationScheme = {
  params: {
    id: Joi.number().positive(),
  },
  body: {
    eventId: Joi.string().uuid(),
    description: Joi.string().allow(''),
    date: Joi.date().iso(),
  },
};

/**
 * @swagger
 * /api/reminders/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a reminder
 *     tags:
 *      - Reminders
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: No response, the delete was successfull
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const deleteReminder = async (ctx) => {
  await reminderService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteReminder.validationScheme = {
  id: Joi.string().uuid(),
};

module.exports = (app) => {
  const router = new Router({ prefix: '/reminders' });

  router.get('/', requireAuthentication, validate(getAllReminders.validationScheme), getAllReminders);
  router.post('/', requireAuthentication, validate(createReminder.validationScheme), createReminder);
  router.get('/:id', requireAuthentication, validate(getReminderByEventId.validationScheme), getReminderByEventId);
  router.put('/:id', requireAuthentication, validate(updateReminder.validationScheme),updateReminder);
  router.delete('/:id', requireAuthentication, validate(deleteReminder.validationScheme), deleteReminder);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};
