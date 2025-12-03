import type { Reel } from './reels.types';

const mockReels: Reel[] = [
  {
    id: 1,
    video_url: 'https://videos.pexels.com/video-files/3129950/3129950-hd_1920_1080_25fps.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    caption: 'Waves crashing in slow motion 🌊',
    views: 10234,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    video_url: 'https://videos.pexels.com/video-files/856193/856193-hd_1920_1080_24fps.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    caption: 'City run and morning hustle 🏃‍♀️',
    views: 8456,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    video_url: 'https://videos.pexels.com/video-files/854174/854174-hd_1280_720_25fps.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1504593811423-6dd665756598',
    caption: 'Coffee art that looks too good to drink ☕️',
    views: 5644,
    created_at: new Date().toISOString(),
  },
];

export const getAllReels = async (): Promise<Reel[]> => {
  return mockReels;
};
