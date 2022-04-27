module.exports = {
  log: {
    level: 'info',
    disabled: false,
  },

  cors: {
    origins: [
      'http://localhost:3000',
      'https://joranvanbellehogent.github.io/frontendweb-karine-2122-JoranVanBelleHoGent/'
    ],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: 'mysql2',
    host: 'localhost',
    port: 3306,
    name: 'calendar',
  },
  pagination: {
    limit: 100,
    offset: 0,
  },
  auth: {
    argon: {
      saltLength: 16,
      hashlength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,

    },
    jwt: {
      // secret via .env
      expirationInterval: 60 * 60 * 1000, // 1h
      issuer: 'Calendar.JoranVanBelle',
      audience: 'Calendar.JoranVanBelle',
    },
  },
};
