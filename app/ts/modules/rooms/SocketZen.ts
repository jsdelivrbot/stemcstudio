
//
// Symbolic constants for socket.io event names.
//
const EVENT_SOCKET_IO_CONNECTING = 'connecting';
const EVENT_SOCKET_IO_CONNECT = 'connect';
const EVENT_SOCKET_IO_CONNECT_FAILED = 'connect_failed';

// const EVENT_SOCKET_IO_RECONNECTING = 'reconnecting';
// const EVENT_SOCKET_IO_RECONNECT = 'reconnect';
// const EVENT_SOCKET_IO_RECONNECT_FAILED = 'reconnect_failed';

const EVENT_SOCKET_IO_DISCONNECT = 'disconnect';
const EVENT_SOCKET_IO_ERROR = 'error';
// const EVENT_SOCKET_IO_MESSAGE = 'message';

/**
 * A wrapper around a SocketIOClient.Socket to make connecting and disconnecting more zone friendly.
 * Using a Promise allows us to determine easily that a connect or disconnect has completed.
 * Navigating while socket events are in flight can cause zone errors.
 * These are manifest in AngularJS as "$digest already in progress".
 */
export class SocketZen {
    constructor(private socket: SocketIOClient.Socket) {
        // Do nothing.
    }

    /**
     *
     */
    on(eventName: string, callback: Function) {
        this.socket.on(eventName, callback);
    }

    /**
     *
     */
    off(eventName: string, callback: Function) {
        this.socket.off(eventName, callback);
    }

    /**
     * 
     */
    get connected(): boolean {
        return this.socket.connected;
    }

    /**
     * 
     */
    public connect(): Promise<void> {
        const socket = this.socket;
        if (socket && !socket.connected) {

            return new Promise<void>((resolve, reject) => {
                const connectingHandler = () => {
                    // Do Nothing.
                };
                const connectHandler = () => {
                    cleanUp();
                    resolve();
                };
                const connectFailedHandler = () => {
                    cleanUp();
                    reject(new Error(""));
                };
                const errorHandler = (err: any) => {
                    cleanUp();
                    reject(err);
                };

                function cleanUp() {
                    if (socket) {
                        socket.off(EVENT_SOCKET_IO_CONNECTING, connectingHandler);
                        socket.off(EVENT_SOCKET_IO_CONNECT, connectHandler);
                        socket.off(EVENT_SOCKET_IO_CONNECT_FAILED, connectFailedHandler);
                        socket.off(EVENT_SOCKET_IO_ERROR, errorHandler);
                    }
                }

                socket.on(EVENT_SOCKET_IO_CONNECTING, connectingHandler);
                socket.on(EVENT_SOCKET_IO_CONNECT, connectHandler);
                socket.on(EVENT_SOCKET_IO_CONNECT_FAILED, connectFailedHandler);
                socket.on(EVENT_SOCKET_IO_ERROR, errorHandler);

                socket.connect();
            });
        }
        else {
            return new Promise<void>((resolve, reject) => { resolve(); });
        }
    }

    /**
     * 
     */
    public disconnect(): Promise<void> {
        const socket = this.socket;
        if (socket && socket.connected) {

            return new Promise<void>((resolve, reject) => {
                const disconnectHandler = () => {
                    cleanUp();
                    resolve();
                };
                const errorHandler = (err: any) => {
                    cleanUp();
                    reject(err);
                };

                function cleanUp() {
                    if (socket) {
                        socket.off(EVENT_SOCKET_IO_DISCONNECT, disconnectHandler);
                        socket.off(EVENT_SOCKET_IO_ERROR, errorHandler);
                    }
                }

                socket.on(EVENT_SOCKET_IO_DISCONNECT, disconnectHandler);
                socket.on(EVENT_SOCKET_IO_ERROR, errorHandler);

                socket.disconnect();
            });
        }
        else {
            return new Promise<void>((resolve, reject) => { resolve(); });
        }
    }

    /**
     *
     */
    public emit(eventName: string, params: {}, callback: Function) {
        this.socket.emit(eventName, params, callback);
    }
}
