interface Background {
    /**
     * @param owner
     * @param repo
     * @param gistId
     * @param roomId
     * @param monitor
     * @param callback
     */
    loadWsModel(owner: string, repo: string, gistId: string, roomId: string, monitor: boolean, callback: (err: Error) => any): void;
}

export default Background;

export const BACKGROUND_UUID = "com.stemcstudio.background";
