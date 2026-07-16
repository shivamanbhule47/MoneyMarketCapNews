export interface Post {
  id: number;
  title: string;
  category: string; // 'crypto' | 'stocks' | 'forex' | 'economy' | 'tech'
  excerpt: string;
  content: string;
  author: string;
  image: string;
  tags: string[];
  readingTime: string;
  featured: boolean;
  date: string; // ISO date or YYYY-MM-DD
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
  adsCode?: string;
  fileName?: string;
}

export interface Comment {
  id: number;
  postId: number;
  author: string;
  text: string;
  date: string;
}

export interface AMPStory {
  id: number;
  title: string;
  category: string;
  pages: AMPPage[];
  createdAt: string;
}

export interface AMPPage {
  id: number;
  type: 'cover' | 'content' | 'cta';
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}
