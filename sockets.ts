import { Server } from "http";
import { Express } from 'express';
import * as sio from 'socket.io';
import { getEdits, setEdits } from './server/routes/rooms/index';
import MwBroadcast from './server/synchronization/MwBroadcast';
import MwEdits from './server/synchronization/MwEdits';

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
        //
        socket.on('download', function (data: { fromId: string, roomId: string }, ack: (err: any, data: any) => any) {
            const { fromId, roomId } = data;

            console.log(`receiving download request from node '${fromId}'.`);

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
        // @deprecated
        //
        socket.on('join', function (data: { fromId: string, roomId: string }, ack: () => any) {
            const { fromId, roomId } = data;

            console.log(`join(roomId => ${roomId}) request received from fromId => ${fromId}.`);

            socketByNodeId[fromId] = socket;

            socket.leaveAll();

            socket.join(roomId, function (err: any) {
                ack();
                getEdits(fromId, roomId, function (err, data: { fromId: string; roomId: string; files: { [path: string]: MwEdits } }) {
                    const { fromId, roomId, files } = data;
                    const paths = Object.keys(files);
                    for (let i = 0; i < paths.length; i++) {
                        const path = paths[i];
                        const edits = files[path];
                        socket.emit('edits', { fromId, roomId, path, edits });
                    }
                });
            });
        });

        //
        // edits are received when a room is created (by the owner), and whenever changes are made.
        //
        socket.on('edits', function (data: { fromId: string; roomId: string; path: string, edits: MwEdits }, ack: () => any) {
            const { fromId, roomId, path, edits } = data;

            console.log(`node '${fromId}' sending '${path}' edits: ${JSON.stringify(summarize(edits))}`);

            socketByNodeId[fromId] = socket;
            // TODO; Track the inverse mapping so that when a socket disconnects, we can clean up.
            setEdits(fromId, roomId, path, edits, function (err: Error, data: { roomId: string; path: string; broadcast: MwBroadcast }) {
                ack();
                if (!err) {
                    if (data) {
                        const { roomId, path, broadcast } = data;
                        if (broadcast) {
                            const nodeIds = Object.keys(broadcast);
                            for (let i = 0; i < nodeIds.length; i++) {
                                const nodeId = nodeIds[i];
                                const edits = broadcast[nodeId];
                                const target = socketByNodeId[nodeId];
                                if (target) {
                                    console.log(`room sending '${path}' edits: ${JSON.stringify(summarize(edits))} to node '${nodeId}'.`);
                                    target.emit('edits', { fromId: roomId, roomId: nodeId, path, edits });
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

        socket.on('error', function error(err: any) {
            console.log(`Something is rotten in Denmark: ${err}`);
        });

        socket.on('disconnect', function disconnet() {
            console.log('A socket disconnected.');
        });
    });
}
