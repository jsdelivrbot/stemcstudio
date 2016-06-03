"use strict";
var sio = require('socket.io');
var rooms = require('./server/routes/rooms/index');
function sockets(app, server) {
    var io = sio(server, {});
    io.on('connection', function (socket) {
        console.log('A user connected');
        socket.on('join', function (name, ack) {
            console.log("join(" + name + ") request received.");
            socket.leaveAll();
            socket.join(name, function (err) {
                console.log(JSON.stringify(socket.rooms));
            });
            ack();
        });
        socket.on('edits', function (edits, ack) {
            rooms.setEdits(edits, function (err, broadcast) {
                console.log("broadcast => {JSON.stringify(broadcast, null, 2)}");
                socket.emit('edits', broadcast);
            });
            ack();
        });
        socket.on('error', function (err) {
            console.log("Something is rotten in Denmark: " + err);
        });
        socket.on('disconnect', function () {
            console.log('A user disconnected');
            io.sockets.emit('chat', 'SERVER', "User has left the building.");
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sockets;
