export type Post = {
  id: number;
  img_url: string;
  caption: string | null;
  created_at: string;
};

const mockPosts: Post[] = [
  {
    id: 1,
    img_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    caption: 'Golden hour on the coast ✨',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    img_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    caption: 'Focus on the grind 📸',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    img_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    caption: 'City lights never sleep 🌃',
    created_at: new Date().toISOString(),
  },
];

export const getAllPosts = async (): Promise<Post[]> => {
  return mockPosts;
};
