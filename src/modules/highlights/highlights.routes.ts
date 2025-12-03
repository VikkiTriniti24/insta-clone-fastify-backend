import { FastifyInstance } from 'fastify';

import { getHighlight, getHighlights } from './highlights.service';

type HighlightsParams = {
  id: string;
};

const highlightsRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/highlights', async () => {
    const highlights = getHighlights(fastify.db);
    return highlights;
  });

  fastify.get<{ Params: HighlightsParams }>('/highlights/:id', async (request, reply) => {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      reply.code(400);
      return { message: 'Invalid highlight id' };
    }

    const highlight = getHighlight(fastify.db, id);

    if (!highlight) {
      reply.code(404);
      return { message: 'Highlight not found' };
    }

    return highlight;
  });
};

export default highlightsRoutes;
