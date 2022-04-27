const data = {
  events: [{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
    userId: '7f28c5f9-d711-4cd6-ac15-d13d71abffab',
    title: 'Backend creëren',
    description: '',
    date: new Date(2021, 11, 8, 12),
    type: 'School',
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
    userId: '7f28c5f9-d711-4cd6-ac15-d13d71abffab',
    title: 'Backend testen',
    description: 'Controleren of er een robuste api is ontwikkeld',
    date: new Date(2021, 11, 8, 15),
    type: 'School',
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
    userId: '7f28c5f9-d711-4cd6-ac15-d13d71abffab',
    title: 'Hardlopen',
    description: '',
    date: new Date(2021, 11, 8, 17),
    type: 'Vrije tijd',
  },
  ],

  users: [{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abffaa',
    name: 'Admin User',
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abffab',
    name: 'Test User',
  },
  ],

  reminders: [{
    eventId: '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
    description: 'Backend creëren start binnenkort',
    date: '2021-12-08 11:30:00.000',
  },
  {
    eventId: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
    description: 'Backend testen start binnenkort',
    date: '2021-12-09 11:30:00.000',
  },
  {
    eventId: '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
    description: 'Hardlopen start binnenkort',
    date: '2021-12-10 11:30:00.000',
  },
  ],
};

const dataToDelete = {
  events: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
  ],

  users: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abffaa',
    '7f28c5f9-d711-4cd6-ac15-d13d71abffab',
  ],

  reminders: ['1', '2', '3'],
};

module.exports = {
  data,
  dataToDelete,
};