import * as http from "http";
import * as express from 'express';
import * as sio from 'socket.io';
import * as rooms from './server/routes/rooms/index';
import MwBroadcast from './server/synchronization/MwBroadcast';
import MwEdits from './server/synchronization/MwEdits';

/**
 * Keep track of the remote nodeId served by the socket so that we can dispatch broadcast messages.
 */
const socketByNodeId: { [nodeId: string]: SocketIO.Socket } = {};

/**
 * The initialization code for the sockets part of this application.
 * Just trying to keep stuff out of the top level web.ts file.
 */
export default function sockets(app: express.Express, server: http.Server) {

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
        //
        //
        socket.on('download', function (data: { fromId: string, roomId: string }, ack: (err: any, data: any) => any) {
            const {fromId, roomId} = data;
            // console.lg(`download(${roomId}) request received from ${fromId}.`);
            rooms.getEdits(fromId, roomId, function (err, data: { fromId: string; roomId: string; files: { [path: string]: MwEdits } }) {
                if (!err) {
                    const {files} = data;
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
            const {fromId, roomId} = data;
            // console.lg(`join(${roomId}) request received from ${fromId}.`);
            socketByNodeId[fromId] = socket;

            socket.leaveAll();

            socket.join(roomId, function (err) {
                ack();
                rooms.getEdits(fromId, roomId, function (err, data: { fromId: string; roomId: string; files: { [path: string]: MwEdits } }) {
                    const {fromId, roomId, files} = data;
                    const paths = Object.keys(files);
                    for (let i = 0; i < paths.length; i++) {
                        const path = paths[i];
                        const edits = files[path];
                        socket.emit('edits', { fromId, roomId, path, edits });
                    }
                });
            });
        });

        socket.on('edits', function (data: { fromId: string; roomId: string; path: string, edits: MwEdits }, ack: () => any) {
            const {fromId, roomId, path, edits} = data;
            socketByNodeId[fromId] = socket;
            // TODO; Track the inverse mapping so that when a socket disconnects, we can clean up.
            rooms.setEdits(fromId, roomId, path, edits, function (err: Error, data: { roomId: string; path: string; broadcast: MwBroadcast }) {
                ack();
                if (!err) {
                    if (data) {
                        const {roomId, path, broadcast} = data;
                        if (broadcast) {
                            const nodeIds = Object.keys(broadcast);
                            for (let i = 0; i < nodeIds.length; i++) {
                                const nodeId = nodeIds[i];
                                const edits = broadcast[nodeId];
                                // console.lg(`edits for ${path} from ${roomId} going to room ${nodeId}`);
                                // console.lg(JSON.stringify(edits, null, 2));
                                const target = socketByNodeId[nodeId];
                                if (target) {
                                    target.emit('edits', { fromId: roomId, roomId: nodeId, path, edits });
                                }
                            }
                        }
                        else {
                            // console.lg("No broadcast in response to setting edits.");
                        }
                    }
                    else {
                        // console.lg("No data in response to setting edits.");
                    }
                }
                else {
                    // console.lg(`Unable to setEdits(from=${fromId}, room=${roomId}, path=${path}): 1 => ${err}, 2 => ${JSON.stringify(err, null, 2)}`);
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
