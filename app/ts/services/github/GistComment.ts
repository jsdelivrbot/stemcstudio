import { GistCommentUser } from './GistCommentUser';

export interface GistComment {
    id: number;
    url: string;
    body: string;
    user: GistCommentUser;
    created_at: string;
    updated_at: string;
}
