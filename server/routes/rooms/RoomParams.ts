interface RoomParams {
    description?: string;
    public?: boolean;
    /**
     * Expiration duration in seconds.
     */
    expire?: number;
}

export default RoomParams;
