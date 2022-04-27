const Router = require('@koa/router');
const healthService = require('../service/health');
const validate = require('./_validation');

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Represents if the server is running
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ping:
 *       allOf:
 *         - type: object
 *           required:
 *             - up
 *           properties:
 *             up:
 *               type: "boolean"
 *     Version:
 *       allOf:
 *         - type: object
 *           required:
 *             - env
 *             - version
 *             - name
 *           properties:
 *             env:
 *               type: "string"
 *             version:
 *               type: "string"
 *             name:
 *               type: "string"
 * 
 *   examples:
 *     Ping:
 *       up: "true"
 *     Version:
 *       env: "development"
 *       version: "1.0.0"
 *       name: "calendar"
 * 
 */

/**
 * @swagger 
 * /api/health/ping: 
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Check if server is running
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: check if the server is running
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ping"
 */

const ping = async (ctx) => {
  ctx.body = healthService.ping();
};
ping.validationScheme = null;

/**
 * @swagger 
 * /api/health/version: 
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Check the specs of the api
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: check the specs of the api
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Version"
 */

const getVersion = async (ctx) => {
  ctx.body = healthService.getVersion();
};
getVersion.validationScheme = null;

module.exports = function installHealthRoutes(app) {
  const router = new Router({
    prefix: '/health',
  });

  router.get('/ping', validate(ping.validationScheme), ping);
  router.get('/version', validate(getVersion.validationScheme), getVersion);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};