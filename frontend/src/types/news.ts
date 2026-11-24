export interface PhotoSize {
    type: string;
    url: string;
    width: number;
    height: number;
}

export interface NewsAttachment {
    type: 'photo' | 'link' | 'video' | string;
    photo?: {
        sizes: Array<PhotoSize>;
    };
    link?: {
        url: string;
        title: string;
        caption?: string;
        description?: string;
        photo?: {
            sizes: Array<PhotoSize>;
        };
    };
    video?: {
        title: string;
        duration?: number;
        image?: Array<PhotoSize>;
        first_frame?: Array<PhotoSize>;
    };
}

export interface NewsPost {
    id: number;
    date: number;
    text: string;
    attachments?: Array<NewsAttachment>;
    comments: { count: number };
    likes: { count: number };
    reposts: { count: number };
    views: { count: number };
}
