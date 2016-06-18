"use strict";
var sio = require('socket.io');
var rooms = require('./server/routes/rooms/index');
var socketByNodeId = {};
function sockets(app, server) {
    var io = sio(server, {});
    io.on('connection', function (socket) {
        console.log('A socket connected.');
        socket.on('download', function (data, ack) {
            var fromId = data.fromId, roomId = data.roomId;
            console.log("download(" + roomId + ") request received from " + fromId + ".");
            rooms.getEdits(fromId, roomId, function (err, data) {
                if (!err) {
                    var files = data.files;
                    ack(err, files);
                }
                else {
                    ack(err, void 0);
                }
            });
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
                    var paths = Object.keys(files);
                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var edits = files[path];
                        socket.emit('edits', { fromId: fromId, roomId: roomId, path: path, edits: edits });
                    }
                });
            });
        });
        socket.on('edits', function (data, ack) {
            var fromId = data.fromId, roomId = data.roomId, path = data.path, edits = data.edits;
            socketByNodeId[fromId] = socket;
            rooms.setEdits(fromId, roomId, path, edits, function (err, data) {
                ack();
                if (!err) {
                    if (data) {
                        var roomId_1 = data.roomId, path_1 = data.path, broadcast = data.broadcast;
                        if (broadcast) {
                            var nodeIds = Object.keys(broadcast);
                            for (var i = 0; i < nodeIds.length; i++) {
                                var nodeId = nodeIds[i];
                                var edits_1 = broadcast[nodeId];
                                console.log("edits for " + path_1 + " from " + roomId_1 + " going to room " + nodeId);
                                console.log(JSON.stringify(edits_1, null, 2));
                                var target = socketByNodeId[nodeId];
                                if (target) {
                                    target.emit('edits', { fromId: roomId_1, roomId: nodeId, path: path_1, edits: edits_1 });
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
                    console.log("Unable to setEdits(from=" + fromId + ", room=" + roomId + ", path=" + path + "): " + JSON.stringify(err, null, 2));
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
