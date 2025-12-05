import { FastifyInstance } from 'fastify';

import { getTaggedGrid } from './tagged.service';

const taggedRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/tagged/grid', async () => {
    const taggedGrid = getTaggedGrid(fastify.db);
    return taggedGrid;
  });
};

export default taggedRoutes;
