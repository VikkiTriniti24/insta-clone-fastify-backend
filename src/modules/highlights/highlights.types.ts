import { z } from 'zod';

const highlightStorySchema = z.object({
  id: z.number(),
  media_url: z.string().url(),
  media_type: z.enum(['image', 'video']),
  posted_at: z.string(),
});

const highlightSchema = z.object({
  id: z.number(),
  title: z.string(),
  cover_img_url: z.string().url(),
  story_count: z.number().int().min(0),
  stories: z.array(highlightStorySchema).optional(),
});

const highlightsSchema = z.array(highlightSchema);

type HighlightStory = z.infer<typeof highlightStorySchema>;
type Highlight = z.infer<typeof highlightSchema>;

export { highlightSchema, highlightsSchema, highlightStorySchema };
export type { Highlight, HighlightStory };
