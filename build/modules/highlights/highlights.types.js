"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlightStorySchema = exports.highlightsSchema = exports.highlightSchema = void 0;
const zod_1 = require("zod");
const highlightStorySchema = zod_1.z.object({
    id: zod_1.z.number(),
    media_url: zod_1.z.string().url(),
    media_type: zod_1.z.enum(['image', 'video']),
    posted_at: zod_1.z.string(),
});
exports.highlightStorySchema = highlightStorySchema;
const highlightSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    cover_img_url: zod_1.z.string().url(),
    story_count: zod_1.z.number().int().min(0),
    stories: zod_1.z.array(highlightStorySchema).optional(),
});
exports.highlightSchema = highlightSchema;
const highlightsSchema = zod_1.z.array(highlightSchema);
exports.highlightsSchema = highlightsSchema;
