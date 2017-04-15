"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sio = require("socket.io");
var index_1 = require("./server/routes/rooms/index");
var SOCKET_EVENT_DOWNLOAD = 'download';
var SOCKET_EVENT_EDITS = 'edits';
function summarize(edits) {
    return edits.x.map(function (change) { return { type: change.a.c, local: change.a.n, remote: change.m }; });
}
var socketByNodeId = {};
function sockets(app, server) {
    var io = sio(server, {});
    io.on('connection', function (socket) {
        console.log('A socket connected.');
        socket.on(SOCKET_EVENT_DOWNLOAD, function (data, ack) {
            var fromId = data.fromId, roomId = data.roomId;
            console.log("receiving '" + SOCKET_EVENT_DOWNLOAD + "' request from node '" + fromId + "' for room '" + roomId + "'.");
            index_1.getEdits(fromId, roomId, function (err, data) {
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
            console.log("join(roomId => " + roomId + ") request received from fromId => " + fromId + ".");
            socketByNodeId[fromId] = socket;
            socket.leaveAll();
            socket.join(roomId, function (err) {
                ack();
                index_1.getEdits(fromId, roomId, function (err, data) {
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
        socket.on(SOCKET_EVENT_EDITS, function (data, ack) {
            var fromId = data.fromId, roomId = data.roomId, path = data.path, edits = data.edits;
            console.log("node '" + fromId + "' sending '" + path + "' edits: " + JSON.stringify(summarize(edits)));
            socketByNodeId[fromId] = socket;
            index_1.setEdits(fromId, roomId, path, edits, function (err, data) {
                ack();
                if (!err) {
                    if (data) {
                        var roomId_1 = data.roomId, path_1 = data.path, broadcast = data.broadcast;
                        if (broadcast) {
                            var nodeIds = Object.keys(broadcast);
                            for (var _i = 0, nodeIds_1 = nodeIds; _i < nodeIds_1.length; _i++) {
                                var nodeId = nodeIds_1[_i];
                                var edits_1 = broadcast[nodeId];
                                var target = socketByNodeId[nodeId];
                                if (target) {
                                    console.log("room sending '" + path_1 + "' edits: " + JSON.stringify(summarize(edits_1)) + " to node '" + nodeId + "'.");
                                    target.emit(SOCKET_EVENT_EDITS, { fromId: roomId_1, roomId: nodeId, path: path_1, edits: edits_1 });
                                }
                                else {
                                    console.log("No emit in response to setting edits for node '" + nodeId + "'.");
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
                    console.log("Unable to setEdits(from=" + fromId + ", room=" + roomId + ", path=" + path + "): 1 => " + err + ", 2 => " + JSON.stringify(err, null, 2));
                }
            });
        });
        socket.on('error', function error(err) {
            console.log("Something is rotten in Denmark. Cause: " + err);
        });
        socket.on('disconnect', function disconnet() {
            console.log('A socket disconnected.');
            console.log("(BEFORE nodeIds => " + Object.keys(socketByNodeId));
            var nodeIds = Object.keys(socketByNodeId);
            for (var _i = 0, nodeIds_2 = nodeIds; _i < nodeIds_2.length; _i++) {
                var nodeId = nodeIds_2[_i];
                if (socketByNodeId[nodeId] === socket) {
                    delete socketByNodeId[nodeId];
                }
            }
            console.log("(AFTER  nodeIds => " + Object.keys(socketByNodeId));
        });
    });
}
exports.default = sockets;
//# sourceMappingURL=sockets.js.map