import type { FastifyInstance } from 'fastify';

import { fileStorageService } from './file-storage.service';

export type Post = {
  id: number;
  img_url: string;
  caption: string | null;
  created_at: string;
};

export type CreatePostData = {
  img_url: string;
  caption: string;
};

type CreatePostServiceArgs = {
  caption: string;
  imageFile?: { buffer: Buffer; filename: string };
};

declare module 'fastify' {
  interface FastifyInstance {
    transactions: {
      posts: {
        create(data: CreatePostData): Post | Promise<Post>;
      };
    };
  }
}

export const postsService = (fastify: FastifyInstance) => {
  return {
    create: async (data: CreatePostServiceArgs) => {
      fastify.log.info(`Creating a new post`);

      let img_url = data.caption;

      if (data.imageFile) {
        // If an image is provided, save it and use returned URL
        img_url = await fileStorageService.saveImage(data.imageFile.buffer, data.imageFile.filename);
      }

      const post = fastify.transactions.posts.create({
        img_url,
        caption: data.caption,
      });
      return post;
    },
  };
};

export const getAllPosts = async (fastify: FastifyInstance): Promise<Post[]> => {
  const statement = fastify.db.prepare(
    `SELECT id, img_url, caption, created_at FROM posts ORDER BY datetime(created_at) DESC`
  );
  return statement.all() as Post[];
};
