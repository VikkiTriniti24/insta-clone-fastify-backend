import type { Database } from 'better-sqlite3';

import { queryAll, queryOne } from '../../core/database/database.transactions';
import type { Highlight, HighlightStory } from './highlights.types';

type HighlightRow = {
  id: number;
  title: string;
  cover_img_url: string;
  story_count: number;
};

type HighlightStoryRow = {
  id: number;
  highlight_id: number;
  media_url: string;
  media_type: 'image' | 'video';
  posted_at: string;
};

const getHighlightRows = (db: Database): HighlightRow[] => {
  return queryAll<HighlightRow>(
    db,
    `
      SELECT id, title, cover_img_url, story_count
      FROM highlights
      ORDER BY id ASC
    `
  );
};

const getHighlightRowById = (db: Database, id: number): HighlightRow | undefined => {
  return queryOne<HighlightRow>(
    db,
    `
      SELECT id, title, cover_img_url, story_count
      FROM highlights
      WHERE id = @id
    `,
    { id }
  );
};

const getHighlightStoriesByHighlightId = (db: Database, id: number): HighlightStoryRow[] => {
  return queryAll<HighlightStoryRow>(
    db,
    `
      SELECT id, highlight_id, media_url, media_type, posted_at
      FROM highlight_stories
      WHERE highlight_id = @id
      ORDER BY posted_at ASC, id ASC
    `,
    { id }
  );
};

export const getHighlights = (db: Database): Highlight[] => {
  const rows = getHighlightRows(db);
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    cover_img_url: row.cover_img_url,
    story_count: row.story_count,
  }));
};

export const getHighlight = (db: Database, id: number): Highlight | null => {
  const row = getHighlightRowById(db, id);

  if (!row) {
    return null;
  }

  const stories = getHighlightStoriesByHighlightId(db, id).map<HighlightStory>((story) => ({
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
