export interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  category: string;
  imageUrl: string;
  status: 'draft' | 'published';
  date: string;
  createdAt?: string;
  updatedAt?: string | null;
  views: number;
  likes: number;
  author: {
    id: number;
    name: string;
  };
  authorId?: number;
  comments?: Comment[];
}

export interface BlogFormData {
  title: string;
  content: string;
  summary: string;
  category: string;
  imageUrl: string;
  status: 'draft' | 'published';
  isDraft: boolean;
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  postId: number;
}

export interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  error: string | null;
  comments: Comment[];
  notifications: Notification[];
}

export interface Notification {
  id: number;
  type: 'comment' | 'like' | 'mention';
  message: string;
  date: string;
  read: boolean;
  relatedPostId?: number;
} 