"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const database_transactions_1 = require("./database.transactions");
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
const CREATE_POSTS_TABLE = `
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    img_url TEXT NOT NULL,
    caption TEXT,
    created_at TEXT NOT NULL
  )
`;
const INSERT_POST = `
  INSERT OR IGNORE INTO posts (
    id,
    img_url,
    caption,
    created_at
  ) VALUES (
    @id,
    @img_url,
    @caption,
    @created_at
  )
`;
const INSERT_POST_MUTATION = `
  INSERT INTO posts (
    img_url,
    caption,
    created_at
  ) VALUES (
    @img_url,
    @caption,
    @created_at
  )
`;
const taggedPostsSeedData = [
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
const highlightsSeedData = [
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
const highlightStoriesSeedData = [
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
const postsSeedData = [
    {
        id: 1,
        img_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
        caption: 'Golden hour on the coast ✨',
        created_at: new Date().toISOString(),
    },
    {
        id: 2,
        img_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
        caption: 'Focus on the grind 📸',
        created_at: new Date().toISOString(),
    },
    {
        id: 3,
        img_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
        caption: 'City lights never sleep 🌃',
        created_at: new Date().toISOString(),
    },
];
const initializeTaggedPosts = (db) => {
    (0, database_transactions_1.runStatements)(db, [CREATE_TAGGED_POSTS_TABLE]);
    const rowsToInsert = taggedPostsSeedData.map((post) => ({
        id: post.id,
        img_url: post.img_url,
        caption: post.caption,
        created_at: post.created_at,
        tagged_by_username: post.tagged_by.username,
        tagged_by_display_name: post.tagged_by.display_name ?? null,
        tagged_by_avatar_url: post.tagged_by.avatar_url ?? null,
    }));
    (0, database_transactions_1.seedTable)(db, INSERT_TAGGED_POST, rowsToInsert);
};
const initializePosts = (db) => {
    (0, database_transactions_1.runStatements)(db, [CREATE_POSTS_TABLE]);
    const rowsToInsert = postsSeedData.map((post) => ({
        id: post.id,
        img_url: post.img_url,
        caption: post.caption,
        created_at: post.created_at,
    }));
    (0, database_transactions_1.seedTable)(db, INSERT_POST, rowsToInsert);
};
const initializeHighlights = (db) => {
    (0, database_transactions_1.runStatements)(db, [CREATE_HIGHLIGHTS_TABLE, CREATE_HIGHLIGHT_STORIES_TABLE]);
    (0, database_transactions_1.seedTable)(db, INSERT_HIGHLIGHT, highlightsSeedData);
    const storyRows = highlightStoriesSeedData.map((story) => ({
        id: story.id,
        highlight_id: story.highlight_id,
        media_url: story.media_url,
        media_type: story.media_type,
        posted_at: story.posted_at,
    }));
    (0, database_transactions_1.seedTable)(db, INSERT_HIGHLIGHT_STORY, storyRows);
};
const databasePlugin = (0, fastify_plugin_1.default)(async (fastify, opts) => {
    const filename = opts.filename ?? process.env.DATABASE_FILENAME ?? ':memory:';
    const db = new better_sqlite3_1.default(filename, opts.options);
    fastify.decorate('db', db);
    initializePosts(db);
    initializeTaggedPosts(db);
    initializeHighlights(db);
    const postsInsertStatement = db.prepare(INSERT_POST_MUTATION);
    fastify.decorate('transactions', {
        posts: {
            create: (data) => {
                const created_at = new Date().toISOString();
                const result = postsInsertStatement.run({
                    img_url: data.img_url,
                    caption: data.caption,
                    created_at,
                });
                return {
                    id: Number(result.lastInsertRowid),
                    img_url: data.img_url,
                    caption: data.caption,
                    created_at,
                };
            },
        },
    });
    fastify.addHook('onClose', (instance, done) => {
        if (instance.db.open) {
            instance.db.close();
        }
        done();
    });
}, { name: 'databasePlugin' });
exports.default = databasePlugin;
