interface Background {
    loadWsModel(owner: string, repo: string, gistId: string, roomId: string, callback: (err: Error) => any): void;
}

export default Background;

export const BACKGROUND_UUID = "com.stemcstudio.background";
