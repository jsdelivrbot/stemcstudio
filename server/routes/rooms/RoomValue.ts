import FzUnit from '../../synchronization/ds/FzUnit';

/**
 * This is what we place in persistent storage.
 * We don't need the id because that will be in the key.
 */
interface RoomValue {

    /**
     * 
     */
    description: string;

    /**
     * 
     */
    public: boolean;

    /**
     * The dehydrated units.
     */
    units: { [fileId: string]: FzUnit };
}

export default RoomValue;
