const Joi = require('joi');
const Router = require('@koa/router');

const userService = require('../service/user');
const Role = require('../core/roles');
const { requireAuthentication, makeRequireRole } = require('../core/auth');

const validate = require('./_validation');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Represents a user
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - name
 *             - email
 *             - password
 *           properties:
 *             name:
 *               type: "string"
 *             email:
 *               type: "email"
 *             password:
 *               type: "password"
 *           example:
 *             $ref: "#/components/examples/User"
 *     UsersList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: application/json
 *               items:
 *                 $ref: "#/components/schemas/User"
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
 *     RegisterFailed:
 *       description: The given email already exists or your password does not match the validationrules
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
 *                 description: Extra information about the specific register error that occured
 *               stack:
 *                 type: string
 *                 description: Strack trace (only available if set in the configuration)
 *             example:
 *               code: "Register Failed"
 *               details: "The given email already exists or your password does not match the validationrules"
 * 
 *     LoginFailed:
 *       description: Combination email - password is not correct
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
 *                 description: Extra information about the specific login error that occured
 *               stack:
 *                 type: string
 *                 description: Strack trace (only available if set in the configuration)
 *             example:
 *               code: "Login Failed"
 *               details: "The combination email - password is not correct"
 * 
 *   examples:
 *     User:
 *       name: "User"
 *       email: "user@calendar.be"
 *       password: "12345678"
 * 
 *   requestBodies:
 *     Register:
 *       description: The user info to register.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: documentation user2
 *               email:
 *                 type: string
 *                 example: "documentation2@calendar.be"
 *               password:
 *                 type: string
 *                 example: "0123456789"
 * 
 *     Login:
 *       description: The user info to login.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "documentation@calendar.be"
 *               password:
 *                 type: string
 *                 example: "12345678"
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Log an user in
 *     tags:
 *      - Users
 *     requestBody:
 *       $ref: "#/components/requestBodies/Login"
 *     responses:
 *       200:
 *         description: The user logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         $ref: "#/components/schemas/LoginFailed"
 */

const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const session = await userService.login(email, password);
  ctx.body = session;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Register a new user
 *     description: Registers a new user.
 *     tags:
 *      - Users
 *     requestBody:
 *       $ref: "#/components/requestBodies/Register"
 *     responses:
 *       200:
 *         description: The registered user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         $ref: "#/components/schemas/RegisterFailed"
 */

const register = async (ctx) => {
  const session = await userService.register(ctx.request.body);
  ctx.body = session;
};
register.validationScheme = {
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(10),
  },
};

/**
 * @swagger 
 * /api/users: 
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all users (paginated)
 *     tags:
 *       - Users
 *     parameters: 
 *       - $ref: "#/components/parameters/limitParam"
 *       - $ref: "#/components/parameters/offsetParam"
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersList"
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const getAllUsers = async (ctx) => {
  const users = await userService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = users;
};
getAllUsers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a single user
 *     tags:
 *      - Users
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.id);
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update an existing user
 *     tags:
 *      - Users
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/User"
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete an user
 *     tags:
 *      - Users
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: No response, the delete was successfull
 *       401:
 *         $ref: "#/components/schemas/UnauthorizedError"
 */

const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });

  // Public routes
  router.post('/login', validate(login.validationScheme), login);
  router.post('/register', validate(register.validationScheme), register);

  const requireAdmin = makeRequireRole(Role.ADMIN);
  
  // Routes with authentication/autorisation
  router.get('/', requireAuthentication, requireAdmin, validate(getAllUsers.validationScheme), getAllUsers);
  router.get('/:id', requireAuthentication, validate(getUserById.validationScheme), getUserById);
  router.put('/:id', requireAuthentication, requireAdmin, validate(updateUserById.validationScheme), updateUserById);
  router.delete('/:id', requireAuthentication, requireAdmin, validate(deleteUserById.validationScheme), deleteUserById);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};