interface PathContents {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    /**
     * 'file'
     */
    type: string;
    content: string;
    /**
     * 'base64'
     */
    encoding: string;
    _links: {
        self: string;
        git: string;
        html: string;
    }
}

export default PathContents;
