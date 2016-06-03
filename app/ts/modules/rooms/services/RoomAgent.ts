import io from 'socket.io-client';
import Room from './Room';
import RoomListener from './RoomListener';
import Shareable from '../../../utils/Shareable';
import MwEdit from '../../../modules/synchronization/MwEdit';

/**
 * 
 */
export default class RoomAgent implements Shareable {
    private _id: string;
    private _socket: SocketIOClient.Socket;
    /**
     * The reference count is 1 immediately following construction.
     */
    private refCount = 1;

    /**
     * 
     */
    constructor(id: string) {
        console.log("RoomAgent.constructor");
        this._id = id;
        // If we don't autoConnect, then how do we connect?
        // Maybe can't use secure if doing localhost?
        this._socket = io.connect({ autoConnect: false/*, secure: true*/ });
        this._socket.on('message', function(socket) {
            console.log("RoomAgent socket message");
        });
        this._socket.on('disconnect', function() {
            // We do get this if the server goes down.
            console.log("RoomAgent got disconnect");
        });
        this._socket.on('connect', function() {
            // This is received when we connect to a server that is already running.
            // We also get this message as the last message when the server comes back up.
            console.log("RoomAgent successfully established a working connection.");
        });
        this._socket.on('connecting', function() {
            // I see this message when I don't auto connect.
            console.log("RoomAgent socket connecting");
        });
        this._socket.on('connect_failed', function() {
            // Haven't seen this.
            console.log("RoomAgent socket connect_failed");
        });
        this._socket.on('error', function(reason) {
            // Haven't seen this.
            console.error("Unable to connect Socket.IO", reason);
        });
        this._socket.on('reconnect_failed', function() {
            // Haven't seen this.
            console.log("RoomAgent socket reconnect_failed");
        });
        this._socket.on('reconnect', function() {
            // We get this event first when the server goes down.
            // We also get it as the server comes up before we get another connect message.
            console.log("RoomAgent socket reconnect");
        });
        this._socket.on('reconnecting', function() {
            // We get this repeatedly when the server is down.
            console.log("RoomAgent socket reconnecting");
        });
        this._socket.on('edits', function(edits) {
            // We do get this custom event.
            console.log(`RoomAgent received edits => {JSON.stringify(edits, null, 2)}`);
        });
        // We'd rather connect outside the constructor, but OK for now.
        this._socket.connect();
        // A custom message is used to tell the server that we want to join or leave a room.
        this._socket.emit('join', this._id, () => {
            console.log(`RoomAgent has joined the ${this._id} room.`);
        });
        // this._socket.disconnect()
    }
    addRef(): number {
        console.log("RoomAgent.addRef")
        if (this.refCount > 0) {
            this.refCount++;
            return this.refCount;
        }
        else {
            throw new Error(`RoomAgent.addRef when refCount is ${this.refCount}`);
        }
    }
    release(): number {
        console.log("RoomAgent.release")
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor();
        }
        return this.refCount;
    }
    protected destructor(): void {
        console.log("RoomAgent.destructor")
        if (this._socket) {
            if (this._socket.connected) {
                this._socket.disconnect();
            }
            this._socket = void 0;
        }
    }
    addListener(roomListener: RoomListener): void {
        console.log("addRoomListener");
    }
    removeListener(roomListener: RoomListener): void {
        console.log("removeRoomListener");
    }
    get id(): string {
        return this._id;
    }
    setEdits(edits: MwEdit[]) {
        console.log("RoomAgent.setEmits()")
        this._socket.emit('edits', edits, () => {
            console.log(`RoomAgent has sent edits to the ${this._id} room.`);
        });
    }
}
