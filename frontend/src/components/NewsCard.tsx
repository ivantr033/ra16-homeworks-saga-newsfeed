import type { NewsPost } from '../types/news';
import {
    formatPostDate,
    formatCounter,
    formatDuration,
    decodeHtmlEntities,
    pickBestPhotoUrl,
} from '../utils/formatters';

interface NewsCardProps {
    post: NewsPost;
}

function renderTextWithLinks(rawText: string) {
    const decoded = decodeHtmlEntities(rawText);
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = decoded.split(urlRegex);

    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            return (
                <a key={index} href={part} target="_blank" rel="noopener noreferrer">
                    {part}
                </a>
            );
        }
        return part;
    });
}

export function NewsCard({ post }: NewsCardProps) {
    const photoAttachment = post.attachments?.find((a) => a.type === 'photo');
    const videoAttachment = post.attachments?.find((a) => a.type === 'video');
    const linkAttachment = post.attachments?.find((a) => a.type === 'link');

    // Extract highest quality available URL across photo, video, or link attachments
    const rawImageUrl =
        pickBestPhotoUrl(photoAttachment?.photo?.sizes) ||
        pickBestPhotoUrl(videoAttachment?.video?.first_frame) ||
        pickBestPhotoUrl(videoAttachment?.video?.image) ||
        pickBestPhotoUrl(linkAttachment?.link?.photo?.sizes);

    const mediaTitle =
        videoAttachment?.video?.title ||
        linkAttachment?.link?.title ||
        'Материалы Нетологии';

    const fallbackBannerUrl = `https://placehold.co/640x480?text=${encodeURIComponent(mediaTitle.slice(0,42))}`;

    return (
        <article className="news-card">
            <header className="news-card-header">
                <div className="author-avatar" aria-hidden="true">
                    ✳
                </div>
                <div className="author-meta">
                    <div className="author-name">Университет интернет-профессий Нетология</div>
                    <time className="post-date">{formatPostDate(post.date)}</time>
                </div>
            </header>

            {post.text && <p className="news-card-text">{renderTextWithLinks(post.text)}</p>}

            {/* Visual Media Block (Photo, Video frame, or Link cover) */}
            {rawImageUrl && (
                <div className="news-card-media">
                    <img
                        src={rawImageUrl}
                        alt={mediaTitle}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackBannerUrl;
                        }}
                    />
                    {videoAttachment?.video && (
                        <div className="video-overlay-badge">
                            <span>▶ {videoAttachment.video.title}</span>
                            {typeof videoAttachment.video.duration === 'number' && (
                                <span className="video-duration">
                                    {formatDuration(videoAttachment.video.duration)}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Link Attachment Card */}
            {linkAttachment?.link && (
                <a
                    href={linkAttachment.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-link-preview"
                >
                    <div className="link-preview-title">{linkAttachment.link.title}</div>
                    {linkAttachment.link.caption && (
                        <div className="link-preview-caption">{linkAttachment.link.caption}</div>
                    )}
                </a>
            )}

            <footer className="news-card-footer">
                <div className="footer-actions">
                    <span className="metric-item" title="Нравится">
                        ♡ {post.likes.count > 0 ? formatCounter(post.likes.count) : ''}
                    </span>
                    <span className="metric-item" title="Комментарии">
                        💬 {post.comments.count > 0 ? formatCounter(post.comments.count) : ''}
                    </span>
                    <span className="metric-item" title="Поделиться">
                        ➦ {post.reposts.count > 0 ? formatCounter(post.reposts.count) : ''}
                    </span>
                </div>

                <span className="metric-views" title="Просмотры">
                    👁 {formatCounter(post.views.count)}
                </span>
            </footer>
        </article>
    );
}
