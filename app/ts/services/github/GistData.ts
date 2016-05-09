interface GistData {
    description: string;
    public: boolean;
    files: { [name: string]: { content: string } };
}

export default GistData;
