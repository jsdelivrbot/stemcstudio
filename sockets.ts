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
        // The handshake data structure provides headers, time, address, xdomain, secure, issued, url, query.
        // I've seen other apps use it to store custom properties.
        // const hs = socket.handshake;
        // const address: string = hs.address;
        // const issued: number = hs.issued;

        socket.on('node', function(nodeId: string, ack: () => any) {
            console.log(`node(${nodeId}) request received.`);
            ack();
        });

        socket.on('join', function(roomId: string, ack: () => any) {
            console.log(`join(${roomId}) request received.`);
            // const rooms: {[id: string]: string} = socket.rooms;
            socket.leaveAll();
            socket.join(roomId, function(err) {
                // Ignore
                // The rooms map appears to be a set (i.e. with values the same as the keys).
                console.log(JSON.stringify(socket.rooms));
            });
            ack();
        });


        // The connection does not reveal who the user actually is.
        // That can be done with another custom message.

        socket.on('edits', function(data: { fromId: string; roomId: string; fileName: string, edits: MwEdits }, ack: () => any) {
            const {fromId, roomId, fileName, edits} = data;
            socketByNodeId[fromId] = socket;
            rooms.setEdits(fromId, roomId, fileName, edits, function(err: any, data: { roomId: string; fileName: string; broadcast: MwBroadcast }) {
                // We'll ack first but it seems we haven't conveyed what happened to the edits.
                ack();
                const {roomId, fileName, broadcast} = data;
                if (!err) {
                    if (broadcast) {
                        const nodeIds = Object.keys(broadcast);
                        for (let i = 0; i < nodeIds.length; i++) {
                            const nodeId = nodeIds[i];
                            const edits = broadcast[nodeId];
                            console.log(`edits from ${roomId} ready for broadcast to room ${nodeId}`);
                            // I'm not going to be doing a room broadcast here because the responses are specific to each client.
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
            // io.sockets.emit('chat', 'SERVER', "User has left the building.");
        });
    });
}
