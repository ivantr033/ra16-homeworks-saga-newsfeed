import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NewsPost } from '../types/news';

const PAGE_LIMIT = 5;

interface NewsState {
    items: Array<NewsPost>;
    loading: boolean;
    error: string | null;
    hasMore: boolean;
}

const initialState: NewsState = {
    items: new Array<NewsPost>(),
    loading: false,
    error: null,
    hasMore: true,
};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        fetchNewsRequested(state) {
            state.loading = true;
            state.error = null;
        },
        fetchNewsSucceeded(state, action: PayloadAction<Array<NewsPost>>) {
            state.loading = false;
            state.error = null;

            // Avoid duplicates if a retry or race occurs
            const existingIds = new Set(state.items.map((item) => item.id));
            const uniqueNewItems = action.payload.filter((item) => !existingIds.has(item.id));
            state.items.push(...uniqueNewItems);

            // If fewer than 5 items returned, no more posts remain
            if (action.payload.length < PAGE_LIMIT) {
                state.hasMore = false;
            }
        },
        fetchNewsFailed(state, action: PayloadAction<string>) {
            // Keep loading true during silent 3s auto-retries
            state.error = action.payload;
        },
    },
});

export const { fetchNewsRequested, fetchNewsSucceeded, fetchNewsFailed } = newsSlice.actions;
export default newsSlice.reducer;
