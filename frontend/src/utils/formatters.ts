import type { PhotoSize } from '../types/news';

export function formatPostDate(unixSeconds: number): string {
    const dateObj = new Date(unixSeconds * 1000);
    const datePart = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'short',
    })
        .format(dateObj)
        .replace('.', '');

    const timePart = new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(dateObj);

    return `${datePart} в ${timePart}`;
}

export function formatCounter(count: number): string {
    if (count >= 1000) {
        const thousands = count / 1000;
        return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}K`;
    }
    return String(count);
}

export function formatDuration(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

export function pickBestPhotoUrl(sizes?: Array<PhotoSize>): string | null {
    if (!sizes || sizes.length === 0) return null;
    // Prefer medium-large resolutions (between 500px and 1280px wide)
    const preferred = sizes.find((s) => s.width >= 500 && s.width <= 1280);
    return preferred ? preferred.url : sizes[sizes.length - 1].url;
}
