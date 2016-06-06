"use strict";
var sio = require('socket.io');
var rooms = require('./server/routes/rooms/index');
var socketByNodeId = {};
function sockets(app, server) {
    var io = sio(server, {});
    io.on('connection', function (socket) {
        console.log('A socket connected.');
        socket.on('node', function (nodeId, ack) {
            console.log("node(" + nodeId + ") request received.");
            ack();
        });
        socket.on('join', function (data, ack) {
            var fromId = data.fromId, roomId = data.roomId;
            console.log("join(" + roomId + ") request received from " + fromId + ".");
            socketByNodeId[fromId] = socket;
            socket.leaveAll();
            socket.join(roomId, function (err) {
                ack();
                rooms.getEdits(fromId, roomId, function (err, data) {
                    var fromId = data.fromId, roomId = data.roomId, files = data.files;
                    var fileNames = Object.keys(files);
                    for (var i = 0; i < fileNames.length; i++) {
                        var fileName = fileNames[i];
                        var edits = files[fileName];
                        socket.emit('edits', { fromId: fromId, roomId: roomId, fileName: fileName, edits: edits });
                    }
                });
            });
        });
        socket.on('edits', function (data, ack) {
            var fromId = data.fromId, roomId = data.roomId, fileName = data.fileName, edits = data.edits;
            socketByNodeId[fromId] = socket;
            rooms.setEdits(fromId, roomId, fileName, edits, function (err, data) {
                ack();
                var roomId = data.roomId, fileName = data.fileName, broadcast = data.broadcast;
                if (!err) {
                    if (broadcast) {
                        var nodeIds = Object.keys(broadcast);
                        for (var i = 0; i < nodeIds.length; i++) {
                            var nodeId = nodeIds[i];
                            var edits_1 = broadcast[nodeId];
                            console.log("edits for " + fileName + " from " + roomId + " going to room " + nodeId);
                            console.log(JSON.stringify(edits_1, null, 2));
                            var target = socketByNodeId[nodeId];
                            if (target) {
                                target.emit('edits', { fromId: roomId, roomId: nodeId, fileName: fileName, edits: edits_1 });
                            }
                        }
                    }
                }
            });
        });
        socket.on('error', function (err) {
            console.log("Something is rotten in Denmark: " + err);
        });
        socket.on('disconnect', function () {
            console.log('A socket disconnected.');
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sockets;
