import { RoomAgent } from './RoomAgent';

export interface RoomParams {

    /**
     * The owner of the room (the GitHub user login).
     */
    owner: string;

    /**
     * 
     */
    description: string;

    /**
     * 
     */
    public: boolean;
}

export interface Room {
    id: string;
    owner: string;
    description: string;
    public: boolean;
}

/**
 * 
 */
export interface IRoomsService {
    /**
     * Creating a room is normally done from a RoomController.
     */
    createRoom(params: RoomParams): Promise<RoomAgent>;

    /**
     * 
     */
    existsRoom(roomId: string): Promise<void>;

    /**
     * Gets a room (agent).
     */
    getRoom(roomId: string): Promise<RoomAgent>;

    /**
     * 
     */
    destroyRoom(roomId: string): Promise<void>;
}

/**
 * 
 */
export const ROOMS_SERVICE_UUID = 'roomsService';
