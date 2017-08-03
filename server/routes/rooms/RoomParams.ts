export interface RoomParams {
    owner: string;
    description?: string;
    public?: boolean;
    /**
     * Expiration duration in seconds.
     */
    expire?: number;
}
