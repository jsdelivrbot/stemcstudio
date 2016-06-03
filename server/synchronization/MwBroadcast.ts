import MwEdit from './MwEdit';

interface MwBroadcast {
    [nodeId: string]: MwEdit[];
}

export default MwBroadcast;
