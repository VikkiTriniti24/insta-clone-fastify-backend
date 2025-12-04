"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taggedPostSchema = exports.taggedGridSchema = exports.taggedBySchema = void 0;
const zod_1 = require("zod");
const taggedBySchema = zod_1.z.object({
    username: zod_1.z.string(),
    display_name: zod_1.z.string().optional(),
    avatar_url: zod_1.z.string().url().optional(),
});
exports.taggedBySchema = taggedBySchema;
const taggedPostSchema = zod_1.z.object({
    id: zod_1.z.number(),
    img_url: zod_1.z.string().url(),
    caption: zod_1.z.string().nullable(),
    created_at: zod_1.z.string(),
    tagged_by: taggedBySchema,
});
exports.taggedPostSchema = taggedPostSchema;
const taggedGridSchema = zod_1.z.array(taggedPostSchema);
exports.taggedGridSchema = taggedGridSchema;
