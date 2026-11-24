import type { NewsPost } from '../types/news';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7070/api';

export async function fetchNewsBatch(lastSeenId?: number): Promise<Array<NewsPost>> {
    const url = new URL(`${API_BASE_URL}/news`);
    if (lastSeenId !== undefined) {
        url.searchParams.set('lastSeenId', String(lastSeenId));
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
}
