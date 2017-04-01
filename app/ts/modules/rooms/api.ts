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

import { IPromise } from 'angular';

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
    createRoom(params: RoomParams): IPromise<RoomAgent>;

    /**
     * 
     */
    getRoom(roomId: string): IPromise<RoomAgent>;

    /**
     * 
     */
    destroyRoom(roomId: string): IPromise<boolean>;
}

/**
 * 
 */
export const ROOMS_SERVICE_UUID = 'roomsService';
