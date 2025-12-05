import Fastify from 'fastify';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import highlightsRoutes from '../src/modules/highlights/highlights.routes.ts';
import databasePlugin from '../src/core/database/database.plugin.ts';

type HighlightStory = {
  id: number;
  media_url: string;
  media_type: 'image' | 'video';
  posted_at: string;
};

type Highlight = {
  id: number;
  title: string;
  cover_img_url: string;
  story_count: number;
  stories?: HighlightStory[];
};

const highlightStories: HighlightStory[] = [
  {
    id: 301,
    media_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5',
    media_type: 'image',
    posted_at: '2024-04-01T10:00:00.000Z',
  },
  {
    id: 302,
    media_url: 'https://videos.pexels.com/video-files/3129950/3129950-hd_1920_1080_25fps.mp4',
    media_type: 'video',
    posted_at: '2024-04-01T12:00:00.000Z',
  },
];

const expectedHighlights: Highlight[] = [
  {
    id: 201,
    title: 'Spring Vibes',
    cover_img_url: 'https://images.unsplash.com/photo-1456916378403-64d5d54b1674',
    story_count: 4,
  },
  {
    id: 202,
    title: 'Food Tour',
    cover_img_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    story_count: 6,
  },
  {
    id: 203,
    title: 'City Nights',
    cover_img_url: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4',
    story_count: 3,
  },
];

const expectedHighlightDetail: Highlight = {
  id: 201,
  title: 'Spring Vibes',
  cover_img_url: 'https://images.unsplash.com/photo-1456916378403-64d5d54b1674',
  story_count: highlightStories.length,
  stories: highlightStories,
};

describe('Highlights routes', () => {
  it('should return all highlights for GET /highlights', async (t) => {
    const app = Fastify();
    t.after(async () => {
      await app.close();
    });

    await app.register(databasePlugin);
    await app.register(highlightsRoutes);

    const response = await app.inject({
      method: 'GET',
      url: '/highlights',
    });

    assert.equal(response.statusCode, 200);

    const highlights = response.json() as Highlight[];
    assert.deepEqual(highlights, expectedHighlights);
    assert.ok(Array.isArray(highlights));
  });

  it('should return a single highlight for GET /highlights/:id', async (t) => {
    const app = Fastify();
    t.after(async () => {
      await app.close();
    });

    await app.register(databasePlugin);
    await app.register(highlightsRoutes);

    const response = await app.inject({
      method: 'GET',
      url: `/highlights/${expectedHighlightDetail.id}`,
    });

    assert.equal(response.statusCode, 200);

    const highlight = response.json() as Highlight;
    assert.deepEqual(highlight, expectedHighlightDetail);
    assert.ok(Array.isArray(highlight.stories));
  });
});
