import { Server } from "http";
import { Express } from 'express';
import * as sio from 'socket.io';
import { getEdits, setEdits } from './server/routes/rooms/index';
import MwBroadcast from './server/synchronization/MwBroadcast';
import MwEdits from './server/synchronization/MwEdits';

/**
 * A request from a client to emit 'edits'.
 */
const SOCKET_EVENT_DOWNLOAD = 'download';
/**
 * A submission of 'edits' from a client to the room and a emission of 'edits' from the room to a client.
 */
const SOCKET_EVENT_EDITS = 'edits';

/**
 * A summary of the edits, for debugging purposes.
 */
function summarize(edits: MwEdits) {
    return edits.x.map(change => { return { type: change.a.c, local: change.a.n, remote: change.m }; });
}

/**
 * Keep track of the remote nodeId served by the socket so that we can dispatch broadcast messages.
 */
const socketByNodeId: { [nodeId: string]: SocketIO.Socket } = {};

/**
 * The initialization code for the sockets part of this application.
 * Just trying to keep stuff out of the top level web.ts file.
 */
export default function sockets(app: Express, server: Server) {

    //
    // The name is arbitrary, the point is that it is a (server) => io
    //
    const io = sio(server, {
        // What is the adapter parameter used for handling rooms?
        // transports: [/*'polling',*/ 'websocket']
    });

    io.on('connection', function (socket: SocketIO.Socket) {
        console.log('A socket connected.');

        //
        // A download request is received when a user joins a room.
        // TODO: Why don't we use this opportunity to associated the fromId with the socket?
        //
        socket.on(SOCKET_EVENT_DOWNLOAD, function (data: { fromId: string, roomId: string }, ack: (err: any, data: any) => any) {
            const { fromId, roomId } = data;

            console.log(`receiving '${SOCKET_EVENT_DOWNLOAD}' from node '${fromId}'`);
            console.log(`(BEFORE nodeIds => ${Object.keys(socketByNodeId)}`);
            // socketByNodeId[fromId] = socket;
            console.log(`(AFTER  nodeIds => ${Object.keys(socketByNodeId)}`);

            getEdits(fromId, roomId, function (err, data: { fromId: string; roomId: string; files: { [path: string]: MwEdits } }) {
                if (!err) {
                    const { files } = data;
                    ack(err, files);
                }
                else {
                    ack(err, void 0);
                }
            });
        });

        //
        // edits are received when a room is created (by the owner), and whenever changes are made.
        //
        socket.on(SOCKET_EVENT_EDITS, function (data: { fromId: string; roomId: string; path: string, edits: MwEdits }, ack: () => any) {
            const { fromId, roomId, path, edits } = data;

            console.log(`receiving ${SOCKET_EVENT_EDITS} from node '${fromId}': ${JSON.stringify(summarize(edits))}`);

            console.log(`(BEFORE nodeIds => ${Object.keys(socketByNodeId)}`);
            socketByNodeId[fromId] = socket;
            console.log(`(AFTER  nodeIds => ${Object.keys(socketByNodeId)}`);

            // TODO; Track the inverse mapping so that when a socket disconnects, we can clean up.
            setEdits(fromId, roomId, path, edits, function (err: Error, data: { roomId: string; path: string; broadcast: MwBroadcast }) {
                ack();
                if (!err) {
                    if (data) {
                        const { roomId, path, broadcast } = data;
                        if (broadcast) {
                            const nodeIds = Object.keys(broadcast);
                            for (const nodeId of nodeIds) {
                                const edits = broadcast[nodeId];
                                const target = socketByNodeId[nodeId];
                                if (target) {
                                    console.log(`room sending '${path}' edits: ${JSON.stringify(summarize(edits))} to node '${nodeId}'.`);
                                    target.emit(SOCKET_EVENT_EDITS, { fromId: roomId, roomId: nodeId, path, edits });
                                }
                                else {
                                    console.log(`No emit in response to setting edits for node '${nodeId}'.`);
                                }
                            }
                        }
                        else {
                            console.log("No broadcast in response to setting edits.");
                        }
                    }
                    else {
                        console.log("No data in response to setting edits.");
                    }
                }
                else {
                    console.log(`Unable to setEdits(from=${fromId}, room=${roomId}, path=${path}): 1 => ${err}, 2 => ${JSON.stringify(err, null, 2)}`);
                }
            });
        });

        //
        //
        //
        socket.on('error', function error(err: any) {
            console.log(`Something is rotten in Denmark. Cause: ${err}`);
        });

        //
        // TODO: When we get a disconnect event, shouldn't we make sure that the socket is not in the map?
        //
        socket.on('disconnect', function disconnet() {
            console.log('A socket disconnected.');
            console.log(`(BEFORE nodeIds => ${Object.keys(socketByNodeId)}`);

            const nodeIds = Object.keys(socketByNodeId);
            for (const nodeId of nodeIds) {
                if (socketByNodeId[nodeId] === socket) {
                    delete socketByNodeId[nodeId];
                }
            }

            console.log(`(AFTER  nodeIds => ${Object.keys(socketByNodeId)}`);
        });
    });
}
