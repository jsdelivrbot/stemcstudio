"use strict";
var redis = require('redis');
var isBoolean_1 = require('../../utils/isBoolean');
var isNumber_1 = require('../../utils/isNumber');
var isString_1 = require('../../utils/isString');
var ServerWorkspace_1 = require('./ServerWorkspace');
var uniqueId_1 = require('./uniqueId');
var MwNode_1 = require('../../synchronization/MwNode');
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
function createRoom(request, response) {
    var params = request.body;
    params.description = isString_1.default(params.description) ? params.description : "";
    params.public = isBoolean_1.default(params.public) ? params.public : true;
    params.expire = isNumber_1.default(params.expire) ? params.expire : 600;
    var roomId = uniqueId_1.default();
    var roomKey = createRoomKey(roomId);
    var sNode = new MwNode_1.default(roomId, new ServerWorkspace_1.default());
    var value = sNode.dehydrate();
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
            var room = {
                id: roomId,
                description: "",
                public: true
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
function setEdits(edits, callback) {
    var iLen = edits.length;
    var _loop_1 = function(i) {
        var edit = edits[i];
        var roomId = edit.t;
        var roomKey = createRoomKey(roomId);
        client.get(roomKey, function (err, reply) {
            if (!err) {
                var before = JSON.parse(reply);
                var sNode = new MwNode_1.default(roomId, new ServerWorkspace_1.default());
                sNode.rehydrate(before);
                sNode.setEdits(edits);
                var broadcast_1 = sNode.getBroadcast();
                var after = sNode.dehydrate();
                client.set(roomKey, JSON.stringify(after), function (err, reply) {
                    callback(err, broadcast_1);
                });
            }
            else {
                callback(err, void 0);
            }
        });
    };
    for (var i = 0; i < iLen; i++) {
        _loop_1(i);
    }
}
exports.setEdits = setEdits;
