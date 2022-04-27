const Router = require('@koa/router');
const installEventRouter = require('./_event');
const installReminderRouter = require('./_reminder');
const installHealthRouter = require('./_health');
const installUsersRouter = require('./_user');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT 
 *   schemas:
 *     Base:
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: "uuid"
 *       example:
 *         id: "6d560fca-e7f9-4583-af2d-b05ccd1a0c58"
 *     ListResponse:
 *       required:
 *         - count
 *         - limit
 *         - offset
 *       properties:
 *         count:
 *           type: integer
 *           description: Number of items returned
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Limit actually used
 *           example: 1
 *         offset:
 *           type: integer
 *           description: Offset actually used
 *           example: 1
 *     User:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - name
 *           properties:
 *             name:
 *               type: "string"
 *             email:
 *               type: "string"
 *               format: email
 *           example:
 *             $ref: "#/components/examples/User"
 *   examples:
 *     User:
 *       id: "7f28c5f9-d711-4cd6-ac15-d13d71abff70"
 *       name: "Joran Van Belle"
 *       email: "joran.vanbelle@live.be"
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     idParam:
 *       in: path
 *       name: id
 *       description: Id of the item to fetch/update/delete
 *       required: true
 *       schema:
 *         type: string
 *         format: "uuid"
 *     limitParam:
 *       in: query
 *       name: limit
 *       description: Maximum amount of items to return
 *       required: false
 *       schema:
 *         type: integer
 *         default: 100
 *     offsetParam:
 *       in: query
 *       name: offset
 *       description: Number of items to skip
 *       required: false
 *       schema:
 *         type: integer
 *         default: 0
 */

/**
 * @swagger
 * components:
 *   responses:
 *     201:
 *       description: Item created
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information about the specific bad request error that occured
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *             example:
 *               code: "VALIDATION_FAILED"
 *               details: "You can only choose a rating between 1 and 5"
 */

/**
 * @swagger
 * components:
 *   responses:
 *     404NotFound:
 *       description: The request resource could not be found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information about the specific not found error that occured
 *               stack:
 *                 type: string
 *                 description: Strack trave (only available if set in the configuration)
 *             example:
 *               code: "NOT_FOUND"
 *               details: "No user with id 99dada36-de4a-42ba-b329-3b1d88778c72 exists"
 */

/**
 * @swagger
 * components:
 *   responses:
 *     400BadRequest:
 *       description: You provided invalid data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information about the specific bad request error that occured
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *             example:
 *               code: "VALIDATION_FAILED"
 *               details: "You can only choose a rating between 1 and 5"
 */

/**
 * @swagger
 * components:
 *   responses:
 *     403Forbidden:
 *       description: You don't have access to this resource
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information about the specific forbidden error that occured
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *             example:
 *               code: "FORBIDDEN"
 *               details: "You are not allowed to view this user's information"
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: You need to be signed in
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information about the specific not found error that occured
 *               stack:
 *                 type: string
 *                 description: Strack trace (only available if set in the configuration)
 *             example:
 *               code: "UNAUTHORIZED"
 *               details: "You need to ne signed in"
 */

/**
 * @swagger
 * components:
 *   responses:

 */

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installEventRouter(router);
  installReminderRouter(router);
  installHealthRouter(router);
  installUsersRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};