import fp from 'fastify-plugin';
import DatabaseConstructor from 'better-sqlite3';
import type { Database as BetterSqlite3Database, Options as BetterSqlite3Options } from 'better-sqlite3';

import type { Highlight, HighlightStory } from '../../modules/highlights/highlights.types';
import type { TaggedPost } from '../../modules/tagged/tagged.types';
import { runStatements, seedTable } from './database.transactions';

declare module 'fastify' {
  interface FastifyInstance {
    db: BetterSqlite3Database;
  }
}

export type DatabasePluginOptions = {
  filename?: string;
  options?: BetterSqlite3Options;
};

const CREATE_TAGGED_POSTS_TABLE = `
  CREATE TABLE IF NOT EXISTS tagged_posts (
    id INTEGER PRIMARY KEY,
    img_url TEXT NOT NULL,
    caption TEXT,
    created_at TEXT NOT NULL,
    tagged_by_username TEXT NOT NULL,
    tagged_by_display_name TEXT,
    tagged_by_avatar_url TEXT
  )
`;

const INSERT_TAGGED_POST = `
  INSERT OR IGNORE INTO tagged_posts (
    id,
    img_url,
    caption,
    created_at,
    tagged_by_username,
    tagged_by_display_name,
    tagged_by_avatar_url
  ) VALUES (
    @id,
    @img_url,
    @caption,
    @created_at,
    @tagged_by_username,
    @tagged_by_display_name,
    @tagged_by_avatar_url
  )
`;

const CREATE_HIGHLIGHTS_TABLE = `
  CREATE TABLE IF NOT EXISTS highlights (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    cover_img_url TEXT NOT NULL,
    story_count INTEGER NOT NULL DEFAULT 0
  )
`;

const CREATE_HIGHLIGHT_STORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS highlight_stories (
    id INTEGER PRIMARY KEY,
    highlight_id INTEGER NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL,
    posted_at TEXT NOT NULL,
    FOREIGN KEY (highlight_id) REFERENCES highlights(id) ON DELETE CASCADE
  )
`;

const INSERT_HIGHLIGHT = `
  INSERT OR IGNORE INTO highlights (
    id,
    title,
    cover_img_url,
    story_count
  ) VALUES (
    @id,
    @title,
    @cover_img_url,
    @story_count
  )
`;

const INSERT_HIGHLIGHT_STORY = `
  INSERT OR IGNORE INTO highlight_stories (
    id,
    highlight_id,
    media_url,
    media_type,
    posted_at
  ) VALUES (
    @id,
    @highlight_id,
    @media_url,
    @media_type,
    @posted_at
  )
`;

const taggedPostsSeedData: TaggedPost[] = [
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

const highlightsSeedData: Highlight[] = [
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

type HighlightStorySeedRow = HighlightStory & { highlight_id: number };

const highlightStoriesSeedData: HighlightStorySeedRow[] = [
  {
    highlight_id: 201,
    id: 301,
    media_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5',
    media_type: 'image',
    posted_at: '2024-04-01T10:00:00.000Z',
  },
  {
    highlight_id: 201,
    id: 302,
    media_url: 'https://videos.pexels.com/video-files/3129950/3129950-hd_1920_1080_25fps.mp4',
    media_type: 'video',
    posted_at: '2024-04-01T12:00:00.000Z',
  },
];

const initializeTaggedPosts = (db: BetterSqlite3Database) => {
  runStatements(db, [CREATE_TAGGED_POSTS_TABLE]);

  const rowsToInsert = taggedPostsSeedData.map((post) => ({
    id: post.id,
    img_url: post.img_url,
    caption: post.caption,
    created_at: post.created_at,
    tagged_by_username: post.tagged_by.username,
    tagged_by_display_name: post.tagged_by.display_name ?? null,
    tagged_by_avatar_url: post.tagged_by.avatar_url ?? null,
  }));

  seedTable(db, INSERT_TAGGED_POST, rowsToInsert);
};

const initializeHighlights = (db: BetterSqlite3Database) => {
  runStatements(db, [CREATE_HIGHLIGHTS_TABLE, CREATE_HIGHLIGHT_STORIES_TABLE]);
  seedTable(db, INSERT_HIGHLIGHT, highlightsSeedData);

  const storyRows = highlightStoriesSeedData.map((story) => ({
    id: story.id,
    highlight_id: story.highlight_id,
    media_url: story.media_url,
    media_type: story.media_type,
    posted_at: story.posted_at,
  }));

  seedTable(db, INSERT_HIGHLIGHT_STORY, storyRows);
};

const databasePlugin = fp<DatabasePluginOptions>(async (fastify, opts) => {
  const filename = opts.filename ?? process.env.DATABASE_FILENAME ?? ':memory:';
  const db = new DatabaseConstructor(filename, opts.options);

  fastify.decorate('db', db);
  initializeTaggedPosts(db);
  initializeHighlights(db);

  fastify.addHook('onClose', (instance, done) => {
    if (instance.db.open) {
      instance.db.close();
    }
    done();
  });
}, { name: 'databasePlugin' });

export default databasePlugin;
