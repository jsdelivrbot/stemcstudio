"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis = require("redis");
var url = require("url");
var asserts_1 = require("../../synchronization/asserts");
var isBoolean_1 = require("../../utils/isBoolean");
var isNumber_1 = require("../../utils/isNumber");
var isString_1 = require("../../utils/isString");
var uniqueId_1 = require("./uniqueId");
var DMP_1 = require("../../synchronization/DMP");
var MwAction_1 = require("../../synchronization/MwAction");
var MwAction_2 = require("../../synchronization/MwAction");
var MwAction_3 = require("../../synchronization/MwAction");
var MwRemote_1 = require("../../synchronization/MwRemote");
var EXPIRE_DURATION_IN_SECONDS = 3600;
var ROOM_NODES_PROPERTY_NAME = 'nodes';
var ROOM_PATHS_PROPERTY_NAME = 'paths';
var ROOM_PATH_CONTENT_PROPERTY_NAME = 'content';
var dmp = new DMP_1.default();
var client;
if (process.env.REDISTOGO_URL) {
    var rtg = url.parse(process.env.REDISTOGO_URL);
    var port = rtg.port;
    client = redis.createClient(port, rtg.hostname);
    var auth = rtg.auth;
    client.auth(auth.split(":")[1]);
}
else {
    client = redis.createClient();
}
client.on('ready', function ready(err) {
    if (err) {
        console.warn("Redis 'ready' failed. " + err);
    }
    else {
        console.warn("Redis is 'ready'.");
    }
});
client.on('connect', function connect(err) {
    if (err) {
        console.warn("Redis could not connect to the server. " + err);
    }
    else {
        console.warn("Redis is connected to the server.");
    }
});
client.on('reconnecting', function reconnecting(err) {
    if (err) {
        console.log("Trying to reconnect to the Redis server after losing the connection...");
    }
    else {
        console.log("Trying to reconnect to the Redis server after losing the connection...");
    }
});
client.on('error', function error(err) {
    console.log("Error " + err);
});
client.on('warning', function warning(err) {
    console.log("Warning " + err);
});
client.on('end', function end(err) {
    console.log("Established Redis server connection has been closed.");
});
function createRoomKey(roomId) {
    return "room:" + roomId;
}
function createRoomPropertyKey(roomId, name) {
    return createRoomKey(roomId) + "@" + name;
}
function createRoomPathKey(roomId, path) {
    return createRoomKey(roomId) + ", path:" + path;
}
function createRoomPathPropertyKey(roomId, path, name) {
    return createRoomPathKey(roomId, path) + "@" + name;
}
function createRemoteKey(roomId, path, nodeId) {
    return createRoomPathKey(roomId, path) + ", node:" + nodeId;
}
function existsKey(key) {
    return new Promise(function (resolve, reject) {
        client.exists(key, function (reason, value) {
            if (!reason) {
                if (value === 1) {
                    resolve(true);
                }
                else if (value === 0) {
                    resolve(false);
                }
                else {
                    reject(new Error("Unexpected value " + value + " for exists."));
                }
            }
            else {
                reject(reason);
            }
        });
    });
}
function createRoom(request, response) {
    var params = request.body;
    params.description = isString_1.default(params.description) ? params.description : "";
    params.public = isBoolean_1.default(params.public) ? params.public : true;
    params.expire = isNumber_1.default(params.expire) ? params.expire : EXPIRE_DURATION_IN_SECONDS;
    var roomId = uniqueId_1.default();
    var roomKey = createRoomKey(roomId);
    var value = {
        owner: params.owner,
        description: params.description,
        public: params.public,
        units: {}
    };
    client.set(roomKey, JSON.stringify(value), function (err, reply) {
        if (!err) {
            client.expire(roomKey, EXPIRE_DURATION_IN_SECONDS, function (err, reply) {
                if (!err) {
                    var room = {
                        id: roomId,
                        owner: params.owner,
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
    var roomParam = request.params;
    var roomId = roomParam.id;
    var roomKey = createRoomKey(roomId);
    client.get(roomKey, function (err, reply) {
        if (!err) {
            redis.print(err, reply);
            var value = JSON.parse(reply);
            if (value) {
                var room = {
                    id: roomId,
                    owner: value.owner,
                    description: value.description,
                    public: value.public
                };
                response.status(200).send(room);
            }
            else {
                response.status(404).send(new Error("Something is rotten in Denmark: " + roomId));
            }
        }
        else {
            response.status(404).send(err);
        }
    });
}
exports.getRoom = getRoom;
function ensureNodeIdInRoom(nodeId, roomId) {
    return new Promise(function (resolve, reject) {
        var roomNodesKey = createRoomPropertyKey(roomId, ROOM_NODES_PROPERTY_NAME);
        client.sismember([roomNodesKey, nodeId], function (reason, exists) {
            if (!reason) {
                asserts_1.mustBeTruthy(isNumber_1.default(exists), "exists must be a number");
                if (exists > 0) {
                    resolve();
                }
                else {
                    client.sadd([roomNodesKey, nodeId], function (reason, reply) {
                        if (!reason) {
                            client.expire(roomNodesKey, EXPIRE_DURATION_IN_SECONDS, function (reason, reply) {
                                resolve();
                            });
                        }
                        else {
                            reject(new Error("Unable to add the node " + nodeId + " to the room. Cause: " + reason));
                        }
                    });
                }
            }
            else {
                reject(new Error("Unable to determine whether node " + nodeId + " exists: " + reason));
            }
        });
    });
}
function ensureFileIdInRoom(fileId, roomId) {
    return new Promise(function (resolve, reject) {
        var roomPathsKey = createRoomPropertyKey(roomId, ROOM_PATHS_PROPERTY_NAME);
        client.sismember([roomPathsKey, fileId], function (reason, exists) {
            if (!reason) {
                asserts_1.mustBeTruthy(isNumber_1.default(exists), "exists must be a number");
                if (exists > 0) {
                    resolve();
                }
                else {
                    client.sadd([roomPathsKey, fileId], function (reason, reply) {
                        if (!reason) {
                            client.expire(roomPathsKey, EXPIRE_DURATION_IN_SECONDS, function (err, reply) {
                                if (!err) {
                                    resolve();
                                }
                                else {
                                    reject(new Error("Unable to set expiration of file " + fileId + " with room " + roomId + ". Cause: " + reason));
                                }
                            });
                        }
                        else {
                            reject(new Error("Unable to add file " + fileId + " to room " + roomId + ". Cause: " + reason));
                        }
                    });
                }
            }
            else {
                reject(new Error("Unable to determine whether file " + fileId + " exists. Cause: " + reason));
            }
        });
    });
}
function getRemote(roomId, path, nodeId) {
    return new Promise(function (resolve, reject) {
        var remoteKey = createRemoteKey(roomId, path, nodeId);
        client.get(remoteKey, function (err, remoteText) {
            if (!err) {
                var remote = new MwRemote_1.default();
                remote.rehydrate(JSON.parse(remoteText));
                resolve(remote);
            }
            else {
                reject(new Error("Unable to getRemote(roomId = " + roomId + ", path = " + path + ", nodeId = " + nodeId + ")"));
            }
        });
    });
}
function setRemote(roomId, path, nodeId, remote, callback) {
    var remoteKey = createRemoteKey(roomId, path, nodeId);
    var dehydrated = remote.dehydrate();
    var remoteText = JSON.stringify(dehydrated);
    client.set(remoteKey, remoteText, function (err, reply) {
        client.expire(remoteKey, EXPIRE_DURATION_IN_SECONDS, function expire(err, reply) {
            callback(err);
        });
    });
}
function ensureRemote(nodeId, path, roomId) {
    return new Promise(function (resolve, reject) {
        var remoteKey = createRemoteKey(roomId, path, nodeId);
        existsKey(remoteKey)
            .then(function (exists) {
            asserts_1.mustBeTruthy(isBoolean_1.default(exists), "exists must be a boolean");
            if (exists) {
                getRemote(roomId, path, nodeId)
                    .then(function (remote) {
                    resolve(remote);
                })
                    .catch(function (reason) {
                    reject(reason);
                });
            }
            else {
                var remote = new MwRemote_1.default();
                setRemote(roomId, path, nodeId, remote, function (err) {
                    if (!err) {
                        getRemote(roomId, path, nodeId)
                            .then(function (remote) {
                            resolve(remote);
                        })
                            .catch(function (reason) {
                            reject(reason);
                        });
                    }
                    else {
                        reject(err);
                    }
                });
            }
        })
            .catch(function (reason) {
            reject(reason);
        });
    });
}
var RedisEditor = (function () {
    function RedisEditor(roomId, path) {
        this.roomId = roomId;
        this.path = path;
        this.refCount = 1;
        this.contentKey = createRoomPathPropertyKey(this.roomId, this.path, ROOM_PATH_CONTENT_PROPERTY_NAME);
    }
    RedisEditor.prototype.getText = function (callback) {
        client.get(this.contentKey, function (err, reply) {
            callback(err, reply);
        });
    };
    RedisEditor.prototype.setText = function (text, callback) {
        var _this = this;
        client.set(this.contentKey, text, function (err, reply) {
            client.expire(_this.contentKey, EXPIRE_DURATION_IN_SECONDS, function (err, reply) {
                callback(err);
            });
        });
    };
    RedisEditor.prototype.patch = function (patches, callback) {
        var _this = this;
        this.getText(function (err, oldText) {
            var result = dmp.patch_apply(patches, oldText);
            var newText = result[0];
            var flags = result[1];
            if (oldText !== newText) {
                _this.setText(newText, function (err) {
                    callback(err, flags);
                });
            }
            else {
                callback(void 0, flags);
            }
        });
    };
    RedisEditor.prototype.release = function () {
        this.refCount--;
        return this.refCount;
    };
    return RedisEditor;
}());
function createDocument(roomId, path, text, callback) {
    var contentKey = createRoomPathPropertyKey(roomId, path, ROOM_PATH_CONTENT_PROPERTY_NAME);
    client.set(contentKey, text, function (err, reply) {
        client.expire(contentKey, EXPIRE_DURATION_IN_SECONDS, function (err, reply) {
            var editor = new RedisEditor(roomId, path);
            callback(err, editor);
            editor.release();
        });
    });
}
function getDocument(roomId, path, callback) {
    var contentKey = createRoomPathPropertyKey(roomId, path, ROOM_PATH_CONTENT_PROPERTY_NAME);
    client.get(contentKey, function (err, reply) {
        var editor = new RedisEditor(roomId, path);
        callback(err, editor);
        editor.release();
    });
}
function deleteDocument(roomId, path, callback) {
    var contentKey = createRoomPathPropertyKey(roomId, path, ROOM_PATH_CONTENT_PROPERTY_NAME);
    client.del(contentKey, function (err, reply) {
        callback(err);
    });
}
function getNodes(roomId) {
    return new Promise(function (resolve, reject) {
        var roomNodesKey = createRoomPropertyKey(roomId, ROOM_NODES_PROPERTY_NAME);
        client.smembers(roomNodesKey, function (err, nodeIds) {
            if (!err) {
                resolve(nodeIds);
            }
            else {
                reject(err);
            }
        });
    });
}
function getPaths(roomId) {
    return new Promise(function (resolve, reject) {
        var roomPathsKey = createRoomPropertyKey(roomId, ROOM_PATHS_PROPERTY_NAME);
        client.smembers(roomPathsKey, function (err, paths) {
            if (!err) {
                resolve(paths);
            }
            else {
                reject(err);
            }
        });
    });
}
function captureFile(roomId, path, nodeId, remote) {
    return new Promise(function (resolve, reject) {
        var shadow = remote.shadow;
        getDocument(roomId, path, function (err, editor) {
            if (editor) {
                editor.getText(function (err, text) {
                    if (!err) {
                        if (shadow) {
                            if (shadow.happy) {
                                resolve(shadow.createDiffTextChange(text));
                            }
                            else {
                                if (remote.containsRawAction(nodeId, text)) {
                                    resolve(void 0);
                                }
                                else {
                                    resolve(shadow.createFullTextChange(text, true));
                                }
                            }
                        }
                        else {
                            var shadow_1 = remote.ensureShadow();
                            resolve(shadow_1.createFullTextChange(text, true));
                        }
                    }
                    else {
                        reject(new Error("Unable to get text from editor."));
                    }
                });
            }
            else {
                reject(new Error("Must be an editor to capture a file."));
            }
        });
    });
}
function captureFileEditsForNode(nodeId, path, roomId) {
    return new Promise(function (resolve, reject) {
        ensureRemote(nodeId, path, roomId)
            .then(function (remote) {
            captureFile(roomId, path, nodeId, remote)
                .then(function (change) {
                remote.addChange(nodeId, change);
                var edits = remote.getEdits(nodeId);
                setRemote(roomId, path, nodeId, remote, function (err) {
                    if (!err) {
                        resolve({ nodeId: nodeId, path: path, edits: edits });
                    }
                    else {
                        reject(err);
                    }
                });
            })
                .catch(function (reason) {
                reject(reason);
            });
        })
            .catch(function (reason) {
            reject(reason);
        });
    });
}
function captureEdits(roomId, path, nodeIds) {
    var outstanding = [];
    for (var _i = 0, nodeIds_1 = nodeIds; _i < nodeIds_1.length; _i++) {
        var nodeId = nodeIds_1[_i];
        outstanding.push(captureFileEditsForNode(nodeId, path, roomId));
    }
    return Promise.all(outstanding);
}
function getBroadcast(roomId, path, callback) {
    getNodes(roomId)
        .then(function (nodeIds) {
        captureEdits(roomId, path, nodeIds)
            .then(function (nodeEdits) {
            var broadcast = {};
            for (var _i = 0, nodeEdits_1 = nodeEdits; _i < nodeEdits_1.length; _i++) {
                var nodeEdit = nodeEdits_1[_i];
                broadcast[nodeEdit.nodeId] = nodeEdit.edits;
            }
            callback(void 0, broadcast);
        })
            .catch(function (err) {
            callback(new Error("Unable to getBroadcast(room = " + roomId + ", path = " + path + "). Cause: " + err));
        });
    })
        .catch(function (reason) {
        callback(reason);
    });
}
function applyEditsFromNodeForFileToRoom(edits, fromId, path, remote, roomId) {
    var outstanding = [];
    var _loop_1 = function (change) {
        var action = change.a;
        if (action) {
            switch (action.c) {
                case MwAction_1.ACTION_RAW_OVERWRITE: {
                    outstanding.push(new Promise(function (resolve, reject) {
                        var text = decodeURI(action.x);
                        createDocument(roomId, path, text, function (err, unused) {
                            if (!err) {
                                var shadow = remote.ensureShadow();
                                shadow.updateRaw(text, action.n);
                                remote.discardChanges(fromId);
                                resolve(action.c);
                            }
                            else {
                                reject(err);
                            }
                        });
                    }));
                    break;
                }
                case MwAction_1.ACTION_RAW_SYNCHONLY: {
                    var text = decodeURI(action.x);
                    var shadow = remote.shadow;
                    shadow.updateRaw(text, action.n);
                    remote.discardChanges(fromId);
                    break;
                }
                case MwAction_2.ACTION_DELTA_OVERWRITE:
                case MwAction_2.ACTION_DELTA_MERGE: {
                    outstanding.push(new Promise(function (resolve, reject) {
                        getDocument(roomId, path, function (err, doc) {
                            if (!err) {
                                var shadow_2 = remote.shadow;
                                var backup_1 = remote.backup;
                                remote.patchDelta(fromId, doc, action.c, action.x, change.m, action.n, function (err) {
                                    if (!err) {
                                        backup_1.copy(shadow_2);
                                        if (typeof change.m === 'number') {
                                            remote.discardActionsLe(fromId, change.m);
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
                    break;
                }
                case MwAction_3.ACTION_NULLIFY_UPPERCASE:
                case MwAction_3.ACTION_NULLIFY_LOWERCASE: {
                    outstanding.push(new Promise(function (resolve, reject) {
                        deleteDocument(roomId, path, function (err) {
                            if (!err) {
                                if (typeof change.m === 'number') {
                                    remote.discardActionsLe(fromId, change.m);
                                }
                                remote.discardChanges(fromId);
                                resolve(action.c);
                            }
                            else {
                                reject(err);
                            }
                        });
                    }));
                    break;
                }
                default: {
                    console.warn("action.c => " + action.c);
                }
            }
        }
        else {
            if (typeof change.m === 'number') {
                remote.discardActionsLe(fromId, change.m);
            }
        }
    };
    for (var _i = 0, _a = edits.x; _i < _a.length; _i++) {
        var change = _a[_i];
        _loop_1(change);
    }
    return Promise.all(outstanding);
}
function setEdits(fromId, roomId, fileId, edits, callback) {
    Promise.all([ensureNodeIdInRoom(fromId, roomId), ensureFileIdInRoom(fileId, roomId)])
        .then(function () {
        ensureRemote(fromId, fileId, roomId)
            .then(function (remote) {
            applyEditsFromNodeForFileToRoom(edits, fromId, fileId, remote, roomId)
                .then(function () {
                setRemote(roomId, fileId, fromId, remote, function (err) {
                    if (!err) {
                        getBroadcast(roomId, fileId, function (err, broadcast) {
                            if (!err) {
                                callback(err, { roomId: roomId, path: fileId, broadcast: broadcast });
                            }
                            else {
                                callback(err);
                            }
                        });
                    }
                    else {
                        callback(err);
                    }
                });
            })
                .catch(function (err) {
                callback(new Error("Unable to apply the edits: " + err), void 0);
            });
        })
            .catch(function (reason) {
            callback(new Error("Unable to ensure remote (room=" + roomId + ", file=" + fileId + ", fromId=" + fromId + "): " + reason));
        });
    })
        .catch(function (reason) {
        callback(reason);
    });
}
exports.setEdits = setEdits;
function getEdits(nodeId, roomId, callback) {
    ensureNodeIdInRoom(nodeId, roomId)
        .then(function () {
        getPaths(roomId)
            .then(function (paths) {
            var outstanding = paths.map(function (path) { return captureFileEditsForNode(nodeId, path, roomId); });
            Promise.all(outstanding)
                .then(function (pathEdits) {
                var files = {};
                for (var _i = 0, pathEdits_1 = pathEdits; _i < pathEdits_1.length; _i++) {
                    var pathEdit = pathEdits_1[_i];
                    files[pathEdit.path] = pathEdit.edits;
                }
                callback(void 0, { fromId: roomId, roomId: nodeId, files: files });
            })
                .catch(function (err) {
                callback(err, void 0);
            });
        })
            .catch(function (reason) {
            callback(reason);
        });
    })
        .catch(function (reason) {
        callback(reason);
    });
}
exports.getEdits = getEdits;
function destroyRoom(request, response) {
    var room = request.params;
    var roomId = room.id;
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
//# sourceMappingURL=index.js.map