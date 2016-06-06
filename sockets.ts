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

    io.on('connection', function(socket: SocketIO.Socket) {
        console.log('A socket connected.');

        socket.on('node', function(nodeId: string, ack: () => any) {
            console.log(`node(${nodeId}) request received.`);
            ack();
        });

        socket.on('join', function(data: { fromId: string, roomId: string }, ack: () => any) {
            const {fromId, roomId} = data;
            console.log(`join(${roomId}) request received from ${fromId}.`);
            socketByNodeId[fromId] = socket;

            socket.leaveAll();

            socket.join(roomId, function(err) {
                ack();
                rooms.getEdits(fromId, roomId, function(err, data: { fromId: string; roomId: string; files: { [fileName: string]: MwEdits } }) {
                    const {fromId, roomId, files} = data;
                    const fileNames = Object.keys(files);
                    for (let i = 0; i < fileNames.length; i++) {
                        const fileName = fileNames[i];
                        const edits = files[fileName];
                        socket.emit('edits', { fromId, roomId, fileName, edits });
                    }
                });
            });
        });

        socket.on('edits', function(data: { fromId: string; roomId: string; fileName: string, edits: MwEdits }, ack: () => any) {
            const {fromId, roomId, fileName, edits} = data;
            socketByNodeId[fromId] = socket;
            // TODO; Track the inverse mapping so that when a socket disconnects, we can clean up.
            rooms.setEdits(fromId, roomId, fileName, edits, function(err: any, data: { roomId: string; fileName: string; broadcast: MwBroadcast }) {
                ack();
                const {roomId, fileName, broadcast} = data;
                if (!err) {
                    if (broadcast) {
                        const nodeIds = Object.keys(broadcast);
                        for (let i = 0; i < nodeIds.length; i++) {
                            const nodeId = nodeIds[i];
                            const edits = broadcast[nodeId];
                            console.log(`edits for ${fileName} from ${roomId} going to room ${nodeId}`);
                            console.log(JSON.stringify(edits, null, 2));
                            const target = socketByNodeId[nodeId];
                            if (target) {
                                target.emit('edits', { fromId: roomId, roomId: nodeId, fileName, edits });
                            }
                        }
                    }
                }
            });
        });

        socket.on('error', function(err) {
            console.log(`Something is rotten in Denmark: ${err}`);
        });

        socket.on('disconnect', function() {
            console.log('A socket disconnected.');
        });
    });
}
