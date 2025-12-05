import type { Database } from 'better-sqlite3';

import { queryAll } from '../../core/database/database.transactions';
import type { TaggedPost } from './tagged.types';

type TaggedPostRow = {
  id: number;
  img_url: string;
  caption: string | null;
  created_at: string;
  tagged_by_username: string;
  tagged_by_display_name: string | null;
  tagged_by_avatar_url: string | null;
};

const mapRowToTaggedPost = (row: TaggedPostRow): TaggedPost => {
  const tagged_by: TaggedPost['tagged_by'] = {
    username: row.tagged_by_username,
  };

  if (row.tagged_by_display_name) {
    tagged_by.display_name = row.tagged_by_display_name;
  }

  if (row.tagged_by_avatar_url) {
    tagged_by.avatar_url = row.tagged_by_avatar_url;
  }

  return {
    id: row.id,
    img_url: row.img_url,
    caption: row.caption,
    created_at: row.created_at,
    tagged_by,
  };
};

export const getTaggedGrid = (db: Database): TaggedPost[] => {
  const rows = queryAll<TaggedPostRow>(
    db,
    `
      SELECT
        id,
        img_url,
        caption,
        created_at,
        tagged_by_username,
        tagged_by_display_name,
        tagged_by_avatar_url
      FROM tagged_posts
      ORDER BY datetime(created_at) ASC, id ASC
    `
  );

  return rows.map(mapRowToTaggedPost);
};
