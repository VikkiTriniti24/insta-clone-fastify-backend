import { FastifyInstance } from 'fastify';

import { getAllReels } from './reels.service';

const reelsRoutes = async (fastify: FastifyInstance) => {
  const handler = async () => {
    const reels = await getAllReels();
    return reels;
  };

  fastify.get('/reels', handler);
  fastify.get('/reels/grid', handler);
};

export default reelsRoutes;
