import Fastify from 'fastify';

import postsRoutes from './common/posts.routes';
import databasePlugin from './core/database/database.plugin';
import reelsRoutes from './modules/reels/reels.routes';
import taggedRoutes from './modules/tagged/tagged.routes';
import highlightsRoutes from './modules/highlights/highlights.routes';

const app = Fastify({ logger: true });

app.addHook('onSend', async (_request, reply, payload) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type');
  return payload;
});

app.options('*', async (_request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type');
  reply.send();
});

app.get('/', async () => {
  return 'Hello world';
});

app.register(databasePlugin);
app.register(postsRoutes);
app.register(reelsRoutes);
app.register(taggedRoutes);
app.register(highlightsRoutes);

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT ?? 3000),
      host: process.env.HOST ?? '127.0.0.1',
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
