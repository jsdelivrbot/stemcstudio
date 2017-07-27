export interface TreeKey {
    sha: string;
    url: string;
    tree: {
        path: string;
        mode: string;
        type: string;
        size: number;
        sha: string;
        url: string;
    }[];
}
