import RoomAgent from './RoomAgent';

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
     * 
     */
    createRoom(params: RoomParams): ng.IPromise<RoomAgent>;

    /**
     * 
     */
    getRoom(roomId: string): ng.IPromise<RoomAgent>;

    /**
     * 
     */
    destroyRoom(roomId: string): ng.IPromise<boolean>;
}

/**
 * 
 */
export const ROOMS_SERVICE_UUID = 'roomsService';
