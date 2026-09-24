export default () => ({
  port: parseInt(process.env.PORT ?? '3847', 10),
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5433', 10),
    username: process.env.DATABASE_USER ?? 'portfolio',
    password: process.env.DATABASE_PASSWORD ?? 'portfolio',
    name: process.env.DATABASE_NAME ?? 'portfolio',
  },
  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET ??
      'dev-access-secret-change-in-production!!',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ??
      'dev-refresh-secret-change-in-production!',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
});
