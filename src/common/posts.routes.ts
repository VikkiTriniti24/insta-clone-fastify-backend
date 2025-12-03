import { FastifyInstance } from 'fastify';

import { getAllPosts } from './posts.service';

const postsRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/posts', async () => {
    const posts = await getAllPosts();
    return posts;
  });
};

export default postsRoutes;
