export interface IBackgroundService {
    /**
     * @param owner
     * @param repo
     * @param gistId
     * @param roomId
     * @param callback
     */
    loadWsModel(owner: string, repo: string, gistId: string, roomId: string, callback: (err: Error) => any): void;
}

/**
 * The registration token for AngularJS.
 */
export const BACKGROUND_SERVICE_UUID = "backgroundService";
