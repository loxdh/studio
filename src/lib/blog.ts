
import { Timestamp } from 'firebase/firestore';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  status: 'draft' | 'published';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}
