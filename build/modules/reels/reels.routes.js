"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reels_service_1 = require("./reels.service");
const reelsRoutes = async (fastify) => {
    const handler = async () => {
        const reels = await (0, reels_service_1.getAllReels)();
        return reels;
    };
    fastify.get('/reels', handler);
    fastify.get('/reels/grid', handler);
};
exports.default = reelsRoutes;
