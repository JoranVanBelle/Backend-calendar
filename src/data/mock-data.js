let EVENTS = [
  {
    EventId: 1,
    user: {
      UserId: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
      Naam: 'Joran Van Belle',
    },
    Naam: 'Backend creëren',
    Beschrijving: '',
    Datum: new Date(2021, 11, 8, 13, 0, 0, 0),
  },
  {
    EventId: 2,
    user: {
      UserId: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
      Naam: 'Joran Van Belle',
    },
    Naam: 'Backend testen',
    Beschrijving: 'Controleren of er een robuste api is ontwikkeld',
    date: new Date(2021, 10, 24, 15, 0, 0, 0),
  },
  {
    EventId: 3,
    user: {
      UserId: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
      Naam: 'Lobke Lowie',
    },
    Naam: 'Hardlopen',
    Beschrijving: '',
    date: new Date(2021, 12, 8, 17, 0, 0, 0),
  },
  {
    EventId: 4,
    user: {
      UserId: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
      Naam: 'Lobke Lowie',
    },
    Naam: 'Programmeren',
    Beschrijving: '',
    date: new Date(2021, 10, 24, 17, 0, 0, 0),
  },
];

let REMINDERS = [
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
    eventId: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
    description: 'Backend creëren start binnenkort',
    date: new Date(2021, 11, 8, 12, 30, 0, 0),
  },
];

module.exports = { EVENTS, REMINDERS };
