import fp from 'fastify-plugin';
import DatabaseConstructor from 'better-sqlite3';
import type { Database as BetterSqlite3Database, Options as BetterSqlite3Options } from 'better-sqlite3';

declare module 'fastify' {
  interface FastifyInstance {
    db: BetterSqlite3Database;
  }
}

export type DatabasePluginOptions = {
  filename?: string;
  options?: BetterSqlite3Options;
};

const databasePlugin = fp<DatabasePluginOptions>(async (fastify, opts) => {
  const filename = opts.filename ?? process.env.DATABASE_FILENAME ?? ':memory:';
  const db = new DatabaseConstructor(filename, opts.options);

  fastify.decorate('db', db);

  fastify.addHook('onClose', (instance, done) => {
    if (instance.db.open) {
      instance.db.close();
    }
    done();
  });
}, { name: 'databasePlugin' });

export default databasePlugin;
