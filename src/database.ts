import knexPackage, { Knex } from 'knex';
import env from './env/inex';


export const knexConfig: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_CLIENT === 'sqlite' ? { filename: env.DATABASE_URL, } : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = knexPackage(knexConfig)

// export const db = new sqlite3.Database('./db/database.sqlite', (err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     console.log('Conectado ao banco de dados SQLite.');
//   });
