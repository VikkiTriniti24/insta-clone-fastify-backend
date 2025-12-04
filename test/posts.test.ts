import Fastify from 'fastify';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import postsRoutes from '../src/common/posts.routes';
import databasePlugin from '../src/core/database/database.plugin';

describe('Posts routes', () => {
  it('should get all posts and return them with a 200 status code', async (t) => {
    const app = Fastify();
    t.after(async () => {
      await app.close();
    });

    await app.register(databasePlugin);
    await app.register(postsRoutes);

    const response = await app.inject({
      method: 'GET',
      url: '/posts',
    });

    assert.equal(response.statusCode, 200);
  });
});
