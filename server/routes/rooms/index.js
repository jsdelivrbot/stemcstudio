"use strict";
var redis = require('redis');
var isBoolean_1 = require('../../utils/isBoolean');
var isNumber_1 = require('../../utils/isNumber');
var isString_1 = require('../../utils/isString');
var ServerWorkspace_1 = require('./ServerWorkspace');
var uniqueId_1 = require('./uniqueId');
var MwUnit_1 = require('../../synchronization/MwUnit');
var client = redis.createClient();
client.on('ready', function (err) {
    console.log("Redis connection has been established.");
});
client.on('connect', function (err) {
    console.log("Redis stream is connected to the server.");
});
client.on('reconnecting', function (err) {
    console.log("Trying to reconnect to the Redis server after losing the connection.");
});
client.on('error', function (err) {
    console.log("Error " + err);
});
client.on('warning', function (err) {
    console.log("Warning " + err);
});
client.on('end', function (err) {
    console.log("Established Redis server connection has been closed.");
});
function createRoomKey(roomId) {
    return "room:" + roomId;
}
function inspectUnit(fileName, unit) {
    console.log(fileName);
    var frozen = unit.dehydrate();
    var remotes = frozen.k;
    var nodeIds = Object.keys(remotes);
    for (var i = 0; i < nodeIds.length; i++) {
        var nodeId = nodeIds[i];
        var remote = remotes[nodeId];
        var edits = remote.e;
        var shadow = remote.s;
        var n = shadow.n;
        var m = shadow.m;
        var text = shadow.t;
        var happy = shadow.h;
        console.log("Remote " + nodeId);
        console.log("n: " + n + ", m: " + m + ", happy: " + happy + ", text: " + text);
        console.log("edits: " + JSON.stringify(edits, null, 2));
    }
    unit.rehydrate(frozen);
}
function createRoom(request, response) {
    var params = request.body;
    params.description = isString_1.default(params.description) ? params.description : "";
    params.public = isBoolean_1.default(params.public) ? params.public : true;
    params.expire = isNumber_1.default(params.expire) ? params.expire : 600;
    var roomId = uniqueId_1.default();
    var roomKey = createRoomKey(roomId);
    var value = {
        description: params.description,
        public: params.public,
        units: {}
    };
    client.set(roomKey, JSON.stringify(value), function (err, reply) {
        if (!err) {
            client.expire(roomKey, params.expire, function (err, reply) {
                if (err) {
                    redis.print(err, reply);
                }
            });
            var room = {
                id: roomId,
                description: params.description,
                public: params.public
            };
            response.status(200).send(room);
        }
        else {
            redis.print(err, reply);
            response.status(201).send(err);
        }
    });
}
exports.createRoom = createRoom;
function getRoom(request, response) {
    var params = request.params;
    var roomId = params.id;
    var roomKey = createRoomKey(roomId);
    client.get(roomKey, function (err, reply) {
        if (!err) {
            var value = JSON.parse(reply);
            var room = {
                id: roomId,
                description: value.description,
                public: value.public
            };
            response.status(200).send(room);
        }
        else {
            redis.print(err, reply);
            response.status(404).send(err);
        }
    });
}
exports.getRoom = getRoom;
function setEdits(fromId, roomId, fileName, edits, callback) {
    console.log("setEdits('" + roomId + "', '" + fileName + "'), from '" + fromId + "'.");
    var roomKey = createRoomKey(roomId);
    client.get(roomKey, function (err, reply) {
        if (!err) {
            var room = JSON.parse(reply);
            var unit = new MwUnit_1.default(new ServerWorkspace_1.default());
            var frozen = room.units[fileName];
            if (frozen) {
                unit.rehydrate(frozen);
            }
            inspectUnit(fileName, unit);
            unit.setEdits(fromId, edits);
            inspectUnit(fileName, unit);
            var broadcast_1 = unit.getBroadcast();
            inspectUnit(fileName, unit);
            room.units[fileName] = unit.dehydrate();
            client.set(roomKey, JSON.stringify(room), function (err, reply) {
                callback(err, { roomId: roomId, fileName: fileName, broadcast: broadcast_1 });
            });
        }
        else {
            callback(err, void 0);
        }
    });
}
exports.setEdits = setEdits;
function getEdits(fromId, roomId, callback) {
    var roomKey = createRoomKey(roomId);
    client.get(roomKey, function (err, reply) {
        if (!err) {
            var files_1 = {};
            var room = JSON.parse(reply);
            var fileNames = Object.keys(room.units);
            for (var i = 0; i < fileNames.length; i++) {
                var fileName = fileNames[i];
                var unit = new MwUnit_1.default(new ServerWorkspace_1.default());
                var frozen = room.units[fileName];
                if (frozen) {
                    unit.rehydrate(frozen);
                }
                var edits = unit.getEdits(fromId);
                files_1[fileName] = edits;
                room.units[fileName] = unit.dehydrate();
            }
            client.set(roomKey, JSON.stringify(room), function (err, reply) {
                callback(err, { fromId: roomId, roomId: fromId, files: files_1 });
            });
        }
        else {
            callback(err, void 0);
        }
    });
}
exports.getEdits = getEdits;
function destroyRoom(request, response) {
    var params = request.params;
    console.log("destroyRoom(" + JSON.stringify(params, null, 2) + ")");
    var roomId = params.id;
    var roomKey = createRoomKey(roomId);
    client.del(roomKey, function (err, reply) {
        if (!err) {
            console.log(reply);
            response.status(200).send({});
        }
        else {
            console.log(err);
            response.status(404).send({});
        }
    });
}
exports.destroyRoom = destroyRoom;
