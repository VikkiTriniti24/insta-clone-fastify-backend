"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHighlight = exports.getHighlights = void 0;
const database_transactions_1 = require("../../core/database/database.transactions");
const getHighlightRows = (db) => {
    return (0, database_transactions_1.queryAll)(db, `
      SELECT id, title, cover_img_url, story_count
      FROM highlights
      ORDER BY id ASC
    `);
};
const getHighlightRowById = (db, id) => {
    return (0, database_transactions_1.queryOne)(db, `
      SELECT id, title, cover_img_url, story_count
      FROM highlights
      WHERE id = @id
    `, { id });
};
const getHighlightStoriesByHighlightId = (db, id) => {
    return (0, database_transactions_1.queryAll)(db, `
      SELECT id, highlight_id, media_url, media_type, posted_at
      FROM highlight_stories
      WHERE highlight_id = @id
      ORDER BY posted_at ASC, id ASC
    `, { id });
};
const getHighlights = (db) => {
    const rows = getHighlightRows(db);
    return rows.map((row) => ({
        id: row.id,
        title: row.title,
        cover_img_url: row.cover_img_url,
        story_count: row.story_count,
    }));
};
exports.getHighlights = getHighlights;
const getHighlight = (db, id) => {
    const row = getHighlightRowById(db, id);
    if (!row) {
        return null;
    }
    const stories = getHighlightStoriesByHighlightId(db, id).map((story) => ({
        id: story.id,
        media_url: story.media_url,
        media_type: story.media_type,
        posted_at: story.posted_at,
    }));
    return {
        id: row.id,
        title: row.title,
        cover_img_url: row.cover_img_url,
        story_count: stories.length,
        stories,
    };
};
exports.getHighlight = getHighlight;
