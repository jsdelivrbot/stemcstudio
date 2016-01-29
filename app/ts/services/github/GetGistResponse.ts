import GistFile from './GistFile';

interface GetGistResponse {
    description: string;
    files: { [name: string]: GistFile };
}

export default GetGistResponse;
