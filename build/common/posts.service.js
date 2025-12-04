"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = exports.postsService = void 0;
const file_storage_service_1 = require("./file-storage.service");
const postsService = (fastify) => {
    return {
        create: async (data) => {
            fastify.log.info(`Creating a new post`);
            let img_url = data.caption;
            if (data.imageFile) {
                // If an image is provided, save it and use returned URL
                img_url = await file_storage_service_1.fileStorageService.saveImage(data.imageFile.buffer, data.imageFile.filename);
            }
            const post = fastify.transactions.posts.create({
                img_url,
                caption: data.caption,
            });
            return post;
        },
    };
};
exports.postsService = postsService;
const getAllPosts = async (fastify) => {
    const statement = fastify.db.prepare(`SELECT id, img_url, caption, created_at FROM posts ORDER BY datetime(created_at) DESC`);
    return statement.all();
};
exports.getAllPosts = getAllPosts;
