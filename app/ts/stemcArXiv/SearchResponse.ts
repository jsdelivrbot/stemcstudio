interface SearchResponse {
    found: number;
    start: number;
    refs: {
        href: string;
        owner: string;
        gistId: string;
        title: string;
        author: string;
        keywords: string[];
    }[];
}

export default SearchResponse;

