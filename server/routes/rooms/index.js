"use strict";
var redis = require('redis');
var asserts_1 = require('../../synchronization/asserts');
var isBoolean_1 = require('../../utils/isBoolean');
var isNumber_1 = require('../../utils/isNumber');
var isString_1 = require('../../utils/isString');
var uniqueId_1 = require('./uniqueId');
var MwRemote_1 = require('../../synchronization/MwRemote');
var TEN_MINUTES_IN_SECONDS = 600;
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
function createUnitKey(roomId, path) {
    return createRoomKey(roomId) + ", path:" + path;
}
function createUnitPropertyKey(roomId, path, name) {
    return createUnitKey(roomId, path) + "@" + name;
}
function createRemoteKey(roomId, path, nodeId) {
    return createUnitKey(roomId, path) + ", node:" + nodeId;
}
function createRoom(request, response) {
    var params = request.body;
    params.description = isString_1.default(params.description) ? params.description : "";
    params.public = isBoolean_1.default(params.public) ? params.public : true;
    params.expire = isNumber_1.default(params.expire) ? params.expire : TEN_MINUTES_IN_SECONDS;
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
                if (!err) {
                    var room = {
                        id: roomId,
                        description: params.description,
                        public: params.public
                    };
                    response.status(200).send(room);
                }
                else {
                    response.status(201).send(err);
                }
            });
        }
        else {
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
            response.status(404).send(err);
        }
    });
}
exports.getRoom = getRoom;
function ensureRemoteKey(roomId, path, nodeId, callback) {
    var remotes = createUnitPropertyKey(roomId, path, 'remotes');
    client.sismember([remotes, nodeId], function (reason, exists) {
        if (!reason) {
            asserts_1.mustBeTruthy(isNumber_1.default(exists), "exists must be a number");
            if (exists > 0) {
                callback(void 0);
            }
            else {
                client.sadd([remotes, nodeId], function (reason, reply) {
                    if (!reason) {
                        client.expire(remotes, TEN_MINUTES_IN_SECONDS, function (reason, reply) {
                            callback(reason);
                        });
                    }
                    else {
                        callback(reason);
                    }
                });
            }
        }
        else {
            callback(new Error("Unable to determine whether remote " + nodeId + " exists: " + reason));
        }
    });
}
function ensureRemote(roomId, path, nodeId, callback) {
    var key = createRemoteKey(roomId, path, nodeId);
    client.exists(key, function (err, exists) {
        if (!err) {
            asserts_1.mustBeTruthy(isNumber_1.default(exists), "exists must be a number");
            if (exists > 0) {
                client.get(key, function (err, remoteText) {
                    if (!err) {
                        var remote = new MwRemote_1.default();
                        remote.rehydrate(JSON.parse(remoteText));
                        callback(void 0, remote);
                    }
                    else {
                        callback(new Error(), void 0);
                    }
                });
            }
            else {
                var remote = new MwRemote_1.default();
                var remoteText = JSON.stringify(remote.dehydrate());
                client.set(key, remoteText, function (err, reply) {
                    if (!err) {
                        ensureRemote(roomId, path, nodeId, callback);
                    }
                    else {
                        callback(err, void 0);
                    }
                });
            }
        }
        else {
            callback(err, void 0);
        }
    });
}
function updateRemote(roomId, path, nodeId, remote, callback) {
    console.log("updateRemote(" + roomId + ", " + path + ", " + nodeId + ")");
    var key = createRemoteKey(roomId, path, nodeId);
    var dehydrated = remote.dehydrate();
    var remoteText = JSON.stringify(dehydrated);
    client.set(key, remoteText, function (err, replay) {
        callback(err);
    });
}
var RedisEditor = (function () {
    function RedisEditor(roomId, path) {
        this.roomId = roomId;
        this.path = path;
        this.refCount = 1;
        this.key = createUnitPropertyKey(this.roomId, this.path, 'editor');
    }
    RedisEditor.prototype.getText = function (callback) {
        client.get(this.key, function (err, reply) {
            callback(err, reply);
        });
    };
    RedisEditor.prototype.setText = function (text, callback) {
        client.set(this.key, text, function (err, reply) {
            callback(err);
        });
    };
    RedisEditor.prototype.patch = function () {
        throw new Error("patch");
    };
    RedisEditor.prototype.release = function () {
        this.refCount--;
        return this.refCount;
    };
    return RedisEditor;
}());
function createDocument(roomId, path, text, callback) {
    console.log("createDocument(" + roomId + ", " + path + ")");
    var editorKey = createUnitPropertyKey(roomId, path, 'editor');
    client.set(editorKey, text, function (err, reply) {
        var editor = new RedisEditor(roomId, path);
        callback(err, editor);
        editor.release();
    });
}
function getDocument(roomId, path, callback) {
    console.log("getDocument(" + roomId + ", " + path + ")");
    var editorKey = createUnitPropertyKey(roomId, path, 'editor');
    client.get(editorKey, function (err, reply) {
        var editor = new RedisEditor(roomId, path);
        callback(err, editor);
        editor.release();
    });
}
function deleteDocument(roomId, path, callback) {
    console.log("deleteDocument(" + roomId + ", " + path + ")");
    var editorKey = createUnitPropertyKey(roomId, path, 'editor');
    client.del(editorKey, function (err, reply) {
        callback(err);
    });
}
function getRemoteNodeIds(roomId, path, callback) {
    var remotes = createUnitPropertyKey(roomId, path, 'remotes');
    client.smembers(remotes, function (err, reply) {
        console.log("members => " + JSON.stringify(reply, null, 2));
        callback(err, reply);
    });
}
function captureFile(roomId, path, nodeId, callback) {
    ensureRemote(roomId, path, nodeId, function (err, remote) {
        var shadow = remote.shadow;
        getDocument(roomId, path, function (err, editor) {
            if (editor) {
                editor.getText(function (err, text) {
                    if (!err) {
                        if (shadow) {
                            if (shadow.happy) {
                                callback(void 0, shadow.createDiffTextChange(text));
                            }
                            else {
                                if (remote.containsRawAction(nodeId, text)) {
                                    callback(void 0, void 0);
                                }
                                else {
                                    callback(void 0, shadow.createFullTextChange(text, true));
                                }
                            }
                        }
                        else {
                            var shadow_1 = remote.ensureShadow();
                            callback(void 0, shadow_1.createFullTextChange(text, true));
                        }
                    }
                    else {
                        callback(new Error("Unable to get text from editor."), void 0);
                    }
                });
            }
            else {
                callback(new Error("Must be an editor to capture a file."), void 0);
            }
        });
    });
}
function getBroadcast(roomId, path, callback) {
    getRemoteNodeIds(roomId, path, function (err, nodeIds) {
        if (!err) {
            var iLen = nodeIds.length;
            var outstanding = [];
            var _loop_1 = function(i) {
                var nodeId = nodeIds[i];
                outstanding.push(new Promise(function (resolve, reject) {
                    ensureRemote(roomId, path, nodeId, function (err, remote) {
                        if (!err) {
                            captureFile(roomId, path, nodeId, function (err, change) {
                                if (!err) {
                                    remote.addChange(nodeId, change);
                                    var edits_1 = remote.getEdits(nodeId);
                                    console.log("nodeId=" + nodeId + " => " + JSON.stringify(edits_1, null, 2));
                                    updateRemote(roomId, path, nodeId, remote, function (err) {
                                        if (!err) {
                                            resolve({ nodeId: nodeId, edits: edits_1 });
                                        }
                                        else {
                                            reject(err);
                                        }
                                    });
                                }
                                else {
                                    callback(err, void 0);
                                }
                            });
                        }
                        else {
                            reject(err);
                        }
                    });
                }));
            };
            for (var i = 0; i < iLen; i++) {
                _loop_1(i);
            }
            Promise.all(outstanding).then(function (nodeEdits) {
                console.log("nodeEdits => " + JSON.stringify(nodeEdits, null, 2));
                var broadcast = {};
                for (var i = 0; i < nodeEdits.length; i++) {
                    var nodeEdit = nodeEdits[i];
                    broadcast[nodeEdit.nodeId] = nodeEdit.edits;
                }
                console.log("broadcast => " + JSON.stringify(broadcast, null, 2));
                callback(void 0, broadcast);
            }).catch(function (err) {
                callback(new Error(""), void 0);
            });
        }
        else {
            callback(err, void 0);
        }
    });
}
function setEdits(nodeId, roomId, path, edits, callback) {
    console.log("setEdits('" + roomId + "', '" + path + "'), from '" + nodeId + "'.");
    ensureRemoteKey(roomId, path, nodeId, function (err) {
        if (!err) {
            ensureRemote(roomId, path, nodeId, function (err, remote) {
                if (!err) {
                    var iLen = edits.x.length;
                    var outstanding = [];
                    var _loop_2 = function(i) {
                        var change = edits.x[i];
                        var action = change.a;
                        if (action) {
                            switch (action.c) {
                                case 'R':
                                    {
                                        outstanding.push(new Promise(function (resolve, reject) {
                                            var text = decodeURI(action.x);
                                            createDocument(roomId, path, text, function (err, unused) {
                                                if (!err) {
                                                    var shadow = remote.ensureShadow();
                                                    shadow.updateRaw(text, action.n);
                                                    remote.discardChanges(nodeId);
                                                    resolve(action.c);
                                                }
                                                else {
                                                    reject(err);
                                                }
                                            });
                                        }));
                                    }
                                    break;
                                case 'r':
                                    {
                                        var text = decodeURI(action.x);
                                        var shadow = remote.shadow;
                                        shadow.updateRaw(text, action.n);
                                        remote.discardChanges(nodeId);
                                    }
                                    break;
                                case 'D':
                                case 'd':
                                    {
                                        outstanding.push(new Promise(function (resolve, reject) {
                                            getDocument(roomId, path, function (err, doc) {
                                                if (!err) {
                                                    var shadow_2 = remote.shadow;
                                                    var backup_1 = remote.backup;
                                                    remote.patchDelta(nodeId, doc, action.c, action.x, change.m, action.n, function (err) {
                                                        if (!err) {
                                                            backup_1.copy(shadow_2);
                                                            if (typeof change.m === 'number') {
                                                                remote.discardActionsLe(nodeId, change.m);
                                                            }
                                                            resolve(action.c);
                                                        }
                                                        else {
                                                            reject(err);
                                                        }
                                                    });
                                                }
                                                else {
                                                    reject(err);
                                                }
                                            });
                                        }));
                                    }
                                    break;
                                case 'N':
                                case 'n':
                                    {
                                        outstanding.push(new Promise(function (resolve, reject) {
                                            deleteDocument(roomId, path, function (err) {
                                                if (!err) {
                                                    if (typeof change.m === 'number') {
                                                        remote.discardActionsLe(nodeId, change.m);
                                                    }
                                                    remote.discardChanges(nodeId);
                                                    resolve(action.c);
                                                }
                                                else {
                                                    reject(err);
                                                }
                                            });
                                        }));
                                    }
                                    break;
                                default: {
                                }
                            }
                        }
                        else {
                            if (typeof change.m === 'number') {
                                remote.discardActionsLe(nodeId, change.m);
                            }
                        }
                    };
                    for (var i = 0; i < iLen; i++) {
                        _loop_2(i);
                    }
                    Promise.all(outstanding).then(function (unused) {
                        updateRemote(roomId, path, nodeId, remote, function (err) {
                            getBroadcast(roomId, path, function (err, broadcast) {
                                if (!err) {
                                    callback(err, { roomId: roomId, path: path, broadcast: broadcast });
                                }
                                else {
                                    callback(err, void 0);
                                }
                            });
                        });
                    }).catch(function (err) {
                        callback(new Error("Unable to apply the edits: " + err), void 0);
                    });
                }
                else {
                    callback(new Error("Unable to ensureRemote(room=" + roomId + ", path=" + path + ", nodeId=" + nodeId + "): " + err), void 0);
                }
            });
        }
        else {
            callback(new Error("Unable to ensureRemoteKey(room=" + roomId + ", path=" + path + ", nodeId=" + nodeId + "): " + err), void 0);
        }
    });
}
exports.setEdits = setEdits;
function getEdits(fromId, roomId, callback) {
}
exports.getEdits = getEdits;
function destroyRoom(request, response) {
    var params = request.params;
    var roomId = params.id;
    var roomKey = createRoomKey(roomId);
    client.del(roomKey, function (err, reply) {
        if (!err) {
            response.status(200).send({});
        }
        else {
            response.status(404).send({});
        }
    });
}
exports.destroyRoom = destroyRoom;
