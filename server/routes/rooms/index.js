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
var ROOM_PATHS_PROPERTY_NAME = 'paths';
var ROOM_PATH_CONTENT_PROPERTY_NAME = 'content';
var ROOM_PATH_REMOTES_PROPERTY_NAME = 'remotes';
var dmp = new DMP_1.default();
var client;
if (process.env.REDISTOGO_URL) {
    var rtg = url.parse(process.env.REDISTOGO_URL);
    client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
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
function createRoomPathRemoteKey(roomId, path, nodeId) {
    return createRoomPathKey(roomId, path) + ", node:" + nodeId;
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
    var params = request.params;
    var roomId = params.id;
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
function ensurePathKey(roomId, path, callback) {
    var paths = createRoomPropertyKey(roomId, ROOM_PATHS_PROPERTY_NAME);
    client.sismember([paths, path], function (reason, exists) {
        if (!reason) {
            asserts_1.mustBeTruthy(isNumber_1.default(exists), "exists must be a number");
            if (exists > 0) {
                callback(void 0);
            }
            else {
                client.sadd([paths, path], function (reason, reply) {
                    if (!reason) {
                        client.expire(paths, EXPIRE_DURATION_IN_SECONDS, function (reason, reply) {
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
            callback(new Error("Unable to determine whether path " + path + " exists: " + reason));
        }
    });
}
function ensureRemoteKey(roomId, path, nodeId, callback) {
    ensurePathKey(roomId, path, function (err) {
        if (!err) {
            var remotes_1 = createRoomPathPropertyKey(roomId, path, ROOM_PATH_REMOTES_PROPERTY_NAME);
            client.sismember([remotes_1, nodeId], function (reason, exists) {
                if (!reason) {
                    asserts_1.mustBeTruthy(isNumber_1.default(exists), "exists must be a number");
                    if (exists > 0) {
                        callback(void 0);
                    }
                    else {
                        client.sadd([remotes_1, nodeId], function (reason, reply) {
                            if (!reason) {
                                client.expire(remotes_1, EXPIRE_DURATION_IN_SECONDS, function (reason, reply) {
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
        else {
            callback(err);
        }
    });
}
function getRemote(roomId, path, nodeId, callback) {
    var remoteKey = createRoomPathRemoteKey(roomId, path, nodeId);
    client.get(remoteKey, function (err, remoteText) {
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
function setRemote(roomId, path, nodeId, remote, callback) {
    var remoteKey = createRoomPathRemoteKey(roomId, path, nodeId);
    var dehydrated = remote.dehydrate();
    var remoteText = JSON.stringify(dehydrated);
    client.set(remoteKey, remoteText, function (err, reply) {
        client.expire(remoteKey, EXPIRE_DURATION_IN_SECONDS, function expire(err, reply) {
            callback(err);
        });
    });
}
function ensureRemote(roomId, path, nodeId, callback) {
    var key = createRoomPathRemoteKey(roomId, path, nodeId);
    client.exists(key, function (err, exists) {
        if (!err) {
            asserts_1.mustBeTruthy(isNumber_1.default(exists), "exists must be a number");
            if (exists > 0) {
                getRemote(roomId, path, nodeId, callback);
            }
            else {
                var remote = new MwRemote_1.default();
                setRemote(roomId, path, nodeId, remote, function (err) {
                    if (!err) {
                        getRemote(roomId, path, nodeId, callback);
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
function getPaths(roomId, callback) {
    var paths = createRoomPropertyKey(roomId, ROOM_PATHS_PROPERTY_NAME);
    client.smembers(paths, function (err, reply) {
        callback(err, reply);
    });
}
function getRemoteNodeIds(roomId, path, callback) {
    var remotes = createRoomPathPropertyKey(roomId, path, ROOM_PATH_REMOTES_PROPERTY_NAME);
    client.smembers(remotes, function (err, reply) {
        callback(err, reply);
    });
}
function captureFile(roomId, path, nodeId, remote, callback) {
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
}
function getBroadcast(roomId, path, callback) {
    getRemoteNodeIds(roomId, path, function (err, nodeIds) {
        if (!err) {
            var iLen = nodeIds.length;
            var outstanding = [];
            var _loop_1 = function (i) {
                var nodeId = nodeIds[i];
                outstanding.push(new Promise(function (resolve, reject) {
                    getRemote(roomId, path, nodeId, function (err, remote) {
                        if (!err) {
                            captureFile(roomId, path, nodeId, remote, function (err, change) {
                                if (!err) {
                                    remote.addChange(nodeId, change);
                                    var edits_1 = remote.getEdits(nodeId);
                                    setRemote(roomId, path, nodeId, remote, function (err) {
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
                var broadcast = {};
                for (var i = 0; i < nodeEdits.length; i++) {
                    var nodeEdit = nodeEdits[i];
                    broadcast[nodeEdit.nodeId] = nodeEdit.edits;
                }
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
    ensureRemoteKey(roomId, path, nodeId, function (err) {
        if (!err) {
            ensureRemote(roomId, path, nodeId, function (err, remote) {
                if (!err) {
                    var iLen = edits.x.length;
                    var outstanding = [];
                    var _loop_2 = function (i) {
                        var change = edits.x[i];
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
                                                remote.discardChanges(nodeId);
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
                                    remote.discardChanges(nodeId);
                                    break;
                                }
                                case MwAction_2.ACTION_DELTA_OVERWRITE:
                                case MwAction_2.ACTION_DELTA_MERGE: {
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
                                    break;
                                }
                                case MwAction_3.ACTION_NULLIFY_UPPERCASE:
                                case MwAction_3.ACTION_NULLIFY_LOWERCASE: {
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
                                    break;
                                }
                                default: {
                                    console.warn("action.c => " + action.c);
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
                        setRemote(roomId, path, nodeId, remote, function (err) {
                            if (!err) {
                                getBroadcast(roomId, path, function (err, broadcast) {
                                    if (!err) {
                                        callback(err, { roomId: roomId, path: path, broadcast: broadcast });
                                    }
                                    else {
                                        callback(err, void 0);
                                    }
                                });
                            }
                            else {
                                callback(err, void 0);
                            }
                        });
                    }).catch(function (err) {
                        callback(new Error("Unable to apply the edits: " + err), void 0);
                    });
                }
                else {
                    callback(new Error("Unable to ensure remote (room=" + roomId + ", path=" + path + ", nodeId=" + nodeId + "): " + err), void 0);
                }
            });
        }
        else {
            callback(new Error("Unable to ensureRemoteKey(room=" + roomId + ", path=" + path + ", nodeId=" + nodeId + "): " + err), void 0);
        }
    });
}
exports.setEdits = setEdits;
function getEdits(nodeId, roomId, callback) {
    getPaths(roomId, function (err, paths) {
        var outstanding = [];
        var _loop_3 = function (i) {
            var path = paths[i];
            outstanding.push(new Promise(function (resolve, reject) {
                ensureRemote(roomId, path, nodeId, function (err, remote) {
                    captureFile(roomId, path, nodeId, remote, function (err, change) {
                        if (!err) {
                            remote.addChange(nodeId, change);
                            var edits_2 = remote.getEdits(nodeId);
                            setRemote(roomId, path, nodeId, remote, function (err) {
                                if (!err) {
                                    resolve({ path: path, edits: edits_2 });
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
                });
            }));
        };
        for (var i = 0; i < paths.length; i++) {
            _loop_3(i);
        }
        Promise.all(outstanding).then(function (pathEdits) {
            var files = {};
            for (var i = 0; i < pathEdits.length; i++) {
                var pathEdit = pathEdits[i];
                files[pathEdit.path] = pathEdit.edits;
            }
            callback(void 0, { fromId: roomId, roomId: nodeId, files: files });
        }).catch(function (err) {
            callback(err, void 0);
        });
    });
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
//# sourceMappingURL=index.js.map