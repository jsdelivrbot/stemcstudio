import * as http from "http";
import * as express from 'express';
import * as sio from 'socket.io';
import * as rooms from './server/routes/rooms/index';
import MwBroadcast from './server/synchronization/MwBroadcast';
import MwEdit from './server/synchronization/MwEdit';

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
        console.log('A user connected');
        // The handshake data structure provides headers, time, address, xdomain, secure, issued, url, query.
        // I've seen other apps use it to store custom properties.
        // const hs = socket.handshake;
        // const address: string = hs.address;
        // const issued: number = hs.issued;

        socket.on('join', function(name: string, ack: () => any) {
            console.log(`join(${name}) request received.`);
            // const rooms: {[id: string]: string} = socket.rooms;
            socket.leaveAll();
            socket.join(name, function(err) {
                // Ignore
                // The rooms map appears to be a set (i.e. with values the same as the keys).
                console.log(JSON.stringify(socket.rooms));
            });
            ack();
        });


        // The connection does not reveal who the user actually is.
        // That can be done with another custom message.

        socket.on('edits', function(edits: MwEdit[], ack: () => any) {
            rooms.setEdits(edits, function(err: any, broadcast: MwBroadcast) {
                // TODO: Sockets need to be associated with nodes so that we can send the right edits to the appropriate node.
                console.log(`broadcast => {JSON.stringify(broadcast, null, 2)}`);
                socket.emit('edits', broadcast);
            });
            // If this had been some other message that we want to broadcast to the room...
            // socket.broadcast.to(channel).emit('broadcast', "This is a test of the room broadcast system.");
            // Why do we only ack the good stuff?
            ack();
        });

        socket.on('error', function(err) {
            console.log(`Something is rotten in Denmark: ${err}`);
        });

        socket.on('disconnect', function() {
            console.log('A user disconnected');

            io.sockets.emit('chat', 'SERVER', "User has left the building.");
        });
    });
}
