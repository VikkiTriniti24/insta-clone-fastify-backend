import { z } from 'zod';

const taggedBySchema = z.object({
  username: z.string(),
  display_name: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

const taggedPostSchema = z.object({
  id: z.number(),
  img_url: z.string().url(),
  caption: z.string().nullable(),
  created_at: z.string(),
  tagged_by: taggedBySchema,
});

const taggedGridSchema = z.array(taggedPostSchema);

type TaggedBy = z.infer<typeof taggedBySchema>;
type TaggedPost = z.infer<typeof taggedPostSchema>;

export { taggedBySchema, taggedGridSchema, taggedPostSchema };
export type { TaggedBy, TaggedPost };
