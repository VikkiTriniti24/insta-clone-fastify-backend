"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const highlights_service_1 = require("./highlights.service");
const highlightsRoutes = async (fastify) => {
    fastify.get('/highlights', async () => {
        const highlights = (0, highlights_service_1.getHighlights)(fastify.db);
        return highlights;
    });
    fastify.get('/highlights/:id', async (request, reply) => {
        const id = Number(request.params.id);
        if (Number.isNaN(id)) {
            reply.code(400);
            return { message: 'Invalid highlight id' };
        }
        const highlight = (0, highlights_service_1.getHighlight)(fastify.db, id);
        if (!highlight) {
            reply.code(404);
            return { message: 'Highlight not found' };
        }
        return highlight;
    });
};
exports.default = highlightsRoutes;
