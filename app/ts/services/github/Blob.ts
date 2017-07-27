export interface Blob {
    sha: string;
    size: number;
    url: string;
    content: string;
    /**
     *
     */
    encoding: 'base64';
}
