import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewsRequested } from '../store/newsSlice';
import { NewsCard } from './NewsCard';
import { LoadMoreSpinner } from './LoadMoreSpinner';
import type { RootState } from '../store';

export function NewsFeed() {
    const dispatch = useDispatch();
    const { items, loading, hasMore } = useSelector((state: RootState) => state.news);
    const [infiniteScroll, setInfiniteScroll] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Initial load on mount
    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchNewsRequested());
        }
    }, [items.length, dispatch]);

    // Optional infinite scroll observer
    useEffect(() => {
        if (!infiniteScroll || !hasMore || loading) return;

        const target = sentinelRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    dispatch(fetchNewsRequested());
                }
            },
            { rootMargin: '120px' }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [infiniteScroll, hasMore, loading, dispatch]);

    return (
        <main className="feed-container">
            <div className="feed-topbar">
                <h1 className="feed-heading">Лента новостей</h1>
                <label className="infinite-toggle">
                    <input
                        type="checkbox"
                        checked={infiniteScroll}
                        onChange={(e) => setInfiniteScroll(e.target.checked)}
                    />
                    Бесконечный скролл
                </label>
            </div>

            <div className="feed-list">
                {items.map((post) => (
                    <NewsCard key={post.id} post={post} />
                ))}
            </div>

            {/* Bottom control: hidden completely when hasMore is false */}
            {hasMore && (
                <div ref={sentinelRef} className="feed-bottom-action">
                    {loading ? (
                        <LoadMoreSpinner />
                    ) : (
                        <button
                            type="button"
                            className="load-more-btn"
                            onClick={() => dispatch(fetchNewsRequested())}
                        >
                            К предыдущим записям
                        </button>
                    )}
                </div>
            )}
        </main>
    );
}
