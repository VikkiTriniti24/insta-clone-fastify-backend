import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/', async () => {
  return 'Hello world';
});

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
