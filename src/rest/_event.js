const Joi = require('joi');
const Router = require('@koa/router');
const eventService = require('../service/event');
const { requireAuthentication } = require('../core/auth');
const validate = require('./_validation');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Represents an event of an user
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *             - title
 *             - date
 *             - type
 *             - reminder
 *             - user
 *           properties:
 *             title:
 *               type: "string"
 *             description:
 *               type: "string"
 *             date:
 *               type: "string"
 *               format: "date-time"
 *             type:
 *               type: "string"
 *             user:
 *               $ref: "#/components/schemas/User"
 *           example:
 *             $ref: "#/components/examples/Event"
 *     EventsList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Event"
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
 *     Event:
 *       id: "7f28c5f9-d711-4cd6-ac15-d13d71abff84"
 *       title: "Testing backend"
 *       description: "Checking if my backend can pass the tests"
 *       date: "2021-12-08T14:00:00.000Z"
 *       type: "School"
 *       reminder:
 *         $ref: "#/components/examples/Reminder"
 *       user:
 *         $ref: "#/components/examples/User"
 * 
 *   requestBodies:
 *     Event:
 *       description: The event info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 7f28c5f9-d711-4cd6-ac15-d13d71abff69
 *               title:
 *                 type: string
 *                 example: "Developping backend"
 *               date:
 *                 type: string
 *                 format: "date-time"
 *               type:
 *                 type: string
 *                 example: "School"
 */

/**
 * @swagger 
 * /api/events: 
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all events (paginated)
 *     tags:
 *       - Events
 *     parameters: 
 *       - $ref: "#/components/parameters/limitParam"
 *       - $ref: "#/components/parameters/offsetParam"
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EventsList"
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const getAllEvents = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await eventService.getAll(limit, offset);
};
getAllEvents.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().optional(),
    offset: Joi.number().min(0).integer().optional(),
  }).and('limit', 'offset'),
};

/**
 * @swagger
 * /api/events:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new event
 *     description: Creates a new event for the signed in user.
 *     tags:
 *      - Events
 *     requestBody:
 *       $ref: "#/components/requestBodies/Event"
 *     responses:
 *       200:
 *         description: The created event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const createEvent = async (ctx) => {
  const newEvent = await eventService.create({
    ...ctx.request.body,
    userId: ctx.state.session.userId,
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newEvent;
  ctx.status = 201;
};
createEvent.validationScheme = {
  body: Joi.object({
    userId: Joi.string().uuid(),
    title: Joi.string(),
    description: Joi.string().allow(''),
    date: Joi.date().iso(),
    type: Joi.string(),

  }),
};

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a single event
 *     tags:
 *      - Events
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const getEventById = async (ctx) => {
  ctx.body = await eventService.getById(ctx.params.id);
};
getEventById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update an existing event
 *     tags:
 *      - Events
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/Event"
 *     responses:
 *       200:
 *         description: The updated event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const updateEvent = async (ctx) => {
  ctx.body = await eventService.updateById(ctx.params.id, {
    ...ctx.request.body,
    // userId: ctx.state.session.userId,
    date: new Date(ctx.request.body.date),
  });
};
updateEvent.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    userId: Joi.string().uuid(),
    title: Joi.string().min(1),
    description: Joi.string().allow(''),
    date: Joi.date().iso(),
    type: Joi.string(),
  },
};

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete an event
 *     tags:
 *      - Events
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: No response, the delete was successfull
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const deleteEvent = async (ctx) => {
  await eventService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteEvent.validationScheme = {
  id: Joi.string().uuid(),
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/events',
  });

  router.get('/', requireAuthentication,  validate(getAllEvents.validationScheme), getAllEvents);
  router.post('/', requireAuthentication, validate(createEvent.validationScheme), createEvent);
  router.get('/:id', requireAuthentication,  validate(getEventById.validationScheme), getEventById);
  router.put('/:id', requireAuthentication, validate(updateEvent.validationScheme), updateEvent);
  router.delete('/:id', requireAuthentication,  validate(deleteEvent.validationScheme), deleteEvent);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};