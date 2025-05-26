export default () => ({
  port: parseInt(process.env.PORT ?? '', 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  throttle: {
    short: {
      ttl: parseInt(process.env.THROTTLE_SHORT_TTL ?? '', 10) || 60000,
      limit: parseInt(process.env.THROTTLE_SHORT_LIMIT ?? '', 10) || 10,
    },
    medium: {
      ttl: parseInt(process.env.THROTTLE_MEDIUM_TTL ?? '', 10) || 600000,
      limit: parseInt(process.env.THROTTLE_MEDIUM_LIMIT ?? '', 10) || 100,
    },
    long: {
      ttl: parseInt(process.env.THROTTLE_LONG_TTL ?? '', 10) || 3600000,
      limit: parseInt(process.env.THROTTLE_LONG_LIMIT ?? '', 10) || 1000,
    },
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:4200', 'http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
  },
});
