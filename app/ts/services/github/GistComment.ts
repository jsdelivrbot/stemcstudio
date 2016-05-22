import GistCommentUser from './GistCommentUser';

interface GistComment {
    id: number;
    url: string;
    body: string;
    user: GistCommentUser;
    created_at: string;
    updated_at: string;
}

export default GistComment;
