import WorkspaceScope from '../../../scopes/WorkspaceScope';

interface RoomScope extends WorkspaceScope {
    isCreateRoomEnabled(): boolean;
    isJoinRoomEnabled(): boolean;
    isLeaveRoomEnabled(): boolean;
    isDestroyRoomEnabled(): boolean;
}

export default RoomScope;
