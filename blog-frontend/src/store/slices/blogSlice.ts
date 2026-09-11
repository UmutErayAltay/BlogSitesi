import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BlogState, BlogPost, Comment } from '../../types/blog';
import * as blogService from '../../services/blogService';
import * as commentService from '../../services/commentService';
import { CreatePostData, UpdatePostData } from '../../services/blogService';

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  comments: [],
  notifications: []
};

// Thunks
export const fetchPosts = createAsyncThunk(
  'blog/fetchPosts',
  async () => {
    return await blogService.getPosts();
  }
);

// Admin için tüm postları getir
export const fetchAllPosts = createAsyncThunk(
  'blog/fetchAllPosts',
  async () => {
    return await blogService.getAllPosts();
  }
);

export const createPost = createAsyncThunk(
  'blog/createPost',
  async (post: CreatePostData) => {
    const response = await blogService.createPost(post);
    return response;
  }
);

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async (post: UpdatePostData) => {
    return await blogService.updatePost(post);
  }
);

export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (id: number) => {
    return await blogService.deletePost(id);
  }
);

export const addComment = createAsyncThunk(
  'blog/addComment',
  async ({ postId, content }: { postId: number; content: string }) => {
    const response = await blogService.addComment(postId, { content });
    return response;
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Bir hata oluştu';
      })
      // Fetch all posts (admin)
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Bir hata oluştu';
      })
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Blog yazısı güncellenirken bir hata oluştu';
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload);
      })
      // Yorum ekleme
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.comments = [...(post.comments || []), action.payload];
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Yorum eklenirken bir hata oluştu';
      });
  }
});

export const { setPosts } = blogSlice.actions;
export default blogSlice.reducer; 