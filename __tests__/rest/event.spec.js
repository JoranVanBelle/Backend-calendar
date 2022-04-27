const {
  tables,
} = require('../../src/data');
const {
  withServer,
  login,
} = require('../supertest.setup');
const {
  data,
  dataToDelete,
} = require('../data/mock-data');

describe('Event', () => {
  let request;
  let knex;
  let loginHeader;

  withServer(({
    request: r,
    knex: k,
  }) => {
    request = r;
    knex = k;
  });

  beforeAll(async () => {
    loginHeader = await login(request);

  });

  const url = '/api/events';

  describe('GET /api/events', () => {
    beforeAll(async () => {
      await knex(tables.event).insert(data.events);
      await knex(tables.reminder).insert(data.reminders);
    });

    afterAll(async () => {

      await knex(tables.event).whereIn('id', dataToDelete.events).delete();

      await knex(tables.reminder)
        .whereIn('id', dataToDelete.reminders)
        .delete();
    });

    it('it Should 200 and return all events', async () => {
      const response = await request.get(url).set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBe(3);
    });

    it('it should 200 and paginate the list of events', async () => {
      const response = await request.get(`${url}?limit=2&offset=1`).set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data[0]).toEqual({
        event: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
          title: 'Backend testen',
          description: 'Controleren of er een robuste api is ontwikkeld',
          date: new Date(2021, 11, 8, 15).toJSON(),
          type: 'School',
        },
        user: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abffab',
          name: 'Test User',
        },
      });
      expect(response.body.data[1]).toEqual({
        event: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
          title: 'Hardlopen',
          description: '',
          date: new Date(2021, 11, 8, 17).toJSON(),
          type: 'Vrije tijd',
        },
        user: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abffab',
          name: 'Test User',
        },
      });
    });
  });

  describe('GET /api/events/:id', () => {
    beforeAll(async () => {
      await knex(tables.event).insert(data.events[0]);
      await knex(tables.reminder).insert(data.reminders[0]);
    });

    afterAll(async () => {
      await knex(tables.reminder)
        .where('id', dataToDelete.reminders[0])
        .delete();
      await knex(tables.event).where('id', dataToDelete.events[0]).delete();
    });

    it('should 200 and return the requested event', async () => {
      const eventId = data.events[0].id;
      const response = await request.get(`${url}/${eventId}`).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        event: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
          title: 'Backend creëren',
          description: '',
          date: new Date(2021, 11, 8, 12).toJSON(),
          type: 'School',
        },
        user: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abffab',
          name: 'Test User',
        },
      });
    });
  });

  describe('POST /api/events', () => {
    const eventsToDelete = [];

    beforeAll(async () => {});

    afterAll(async () => {
      // controleren of db volledig leeg is na uitvoeren testen
      await knex(tables.event).whereIn('id', eventsToDelete).delete();
      await knex(tables.reminder).truncate();
    });

    it('should 201 and return the created event', async () => {
      const response = await request.post(url).send({
        userId:'7f28c5f9-d711-4cd6-ac15-d13d71abffab',
        title: 'Dit is een tweede test',
        description: 'Dit is een tweede test',
        date: new Date(2021, 11, 29, 14),
        type: 'School',
      }).set('Authorization', loginHeader);

      expect(response.status).toBe(201);
      expect(response.body.event.id).toBeTruthy();
      expect(response.body.event.title).toBe('Dit is een tweede test');
      expect(response.body.event.description).toBe('Dit is een tweede test');
      expect(response.body.event.date).toBe(new Date(2021, 11, 29, 14).toJSON());
      expect(response.body.event.type).toBe('School');

      expect(response.body.user.id).toBeTruthy();
      expect(response.body.user.name).toBe('Test User');

      eventsToDelete.push(response.body.event.id);
    });
  });

  describe('PUT /api/events/:id', () => {
    const eventsToDelete = [];

    beforeAll(async () => {
      await knex(tables.event).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
        userId: '7f28c5f9-d711-4cd6-ac15-d13d71abffab',
        title: 'Testen maken',
        description: '',
        date: new Date(2022, 11, 29, 14),
        type: 'School',
      }]);
    });

    afterAll(async () => {
      await knex(tables.event).whereIn('id', eventsToDelete).delete();
    });

    it('should 200 and return the updated event', async () => {
      const response = await request
        .put(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff80`)
        .send({
          title: 'Testen maken',
          userId: '7f28c5f9-d711-4cd6-ac15-d13d71abffab',
          description: 'Deze testen willen niet werken',
          date: '2021-12-29 13:00:00',
          type: 'School',
        }).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.event.id).toBeTruthy();
      expect(response.body.event.title).toBe('Testen maken');
      expect(response.body.event.description).toBe(
        'Deze testen willen niet werken',
      );
      expect(response.body.event.date).toBe(new Date(2021, 11, 29, 13).toJSON());
      expect(response.body.event.type).toBe('School');

      eventsToDelete.push(response.body.event.id);
    });
  });

  describe('DELETE /api/events/:id', () => {
    beforeAll(async () => {
      await knex(tables.event).insert({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
        userId: '7f28c5f9-d711-4cd6-ac15-d13d71abffaa',
        title: 'Backend creëren',
        description: '',
        date: '2021-12-29 14:00:00',
        type: 'School',
      });
    });

    afterAll(async () => {});

    it('should 204 and return nothing', async () => {
      const response = await request.delete(
        `${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff89`,
      ).set('Authorization', loginHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
