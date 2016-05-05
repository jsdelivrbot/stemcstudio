interface Blob {
    sha: string;
    size: number;
    url: string;
    content: string;
    /**
     * 'base64'
     */
    encoding: string;
}

export default Blob;
