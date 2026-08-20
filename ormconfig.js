require('dotenv').config();

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5555,
  username: process.env.DB_USERNAME || 'lector',
  password: process.env.DB_PASSWORD || 'lector',
  database: process.env.DB_DATABASE || 'db_lector',
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
