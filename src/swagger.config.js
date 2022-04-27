module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Calendar API with Swagger',
      version: '1.0.0',
      description: 'This is a simple CRUD API application made with Koa and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'developer CalendarAPI',
        url: 'https://joranvanbelle.github.io/',
        email: 'joran.vanbelle@live.be',
      },
    },
    servers: [{
      url: 'http://localhost:9000/',
    }],
  },
  apis: ['./src/rest/*.js'],
};