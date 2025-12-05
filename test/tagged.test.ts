import Fastify from 'fastify';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import taggedRoutes from '../src/modules/tagged/tagged.routes.ts';
import { taggedGridSchema, type TaggedPost } from '../src/modules/tagged/tagged.types.ts';
import databasePlugin from '../src/core/database/database.plugin.ts';

const expectedTaggedGrid: TaggedPost[] = [
  {
    id: 101,
    img_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    caption: 'Sunrise tagged memories',
    created_at: '2024-01-15T08:30:00.000Z',
    tagged_by: {
      username: '@sunrise.stories',
      display_name: 'Sunrise Stories',
    },
  },
  {
    id: 102,
    img_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    caption: 'City evenings with ramen club',
    created_at: '2024-02-04T18:12:00.000Z',
    tagged_by: {
      username: '@cityloop',
      display_name: 'City Loop',
      avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?cityloop',
    },
  },
  {
    id: 103,
    img_url: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b',
    caption: null,
    created_at: '2024-03-21T12:45:00.000Z',
    tagged_by: {
      username: '@trailmixers',
    },
  },
  {
    id: 104,
    img_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    caption: 'Plants tagged and thriving',
    created_at: '2024-04-09T21:04:00.000Z',
    tagged_by: {
      username: '@plantparent',
      display_name: 'Plant Parent',
    },
  },
];

describe('Tagged routes', () => {
  it('should serve the tagged grid data with a 200 status code', async (t) => {
    const app = Fastify();
    t.after(async () => {
      await app.close();
    });

    await app.register(databasePlugin);
    await app.register(taggedRoutes);

    const response = await app.inject({
      method: 'GET',
      url: '/tagged/grid',
    });

    assert.equal(response.statusCode, 200);

    const taggedGrid = taggedGridSchema.parse(response.json());

    assert.deepEqual(taggedGrid, expectedTaggedGrid);
  });
});
