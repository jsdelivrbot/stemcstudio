interface GistData {
    description?: string;
    public: boolean;
    files: { [name: string]: { content: string } | null };
}

export default GistData;
