"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var asserts_1 = require("../../synchronization/asserts");
var isBoolean_1 = require("../../utils/isBoolean");
var isNumber_1 = require("../../utils/isNumber");
var isString_1 = require("../../utils/isString");
var MwAction_1 = require("../../synchronization/MwAction");
var MwAction_2 = require("../../synchronization/MwAction");
var MwAction_3 = require("../../synchronization/MwAction");
var MwRemote_1 = require("../../synchronization/MwRemote");
var EXPIRE_DURATION_IN_SECONDS = 3600;
function createRoomKey(roomId) {
    return "room:" + roomId;
}
function createRoomPathKey(roomId, path) {
    return createRoomKey(roomId) + ", path:" + path;
}
function createRemoteKey(roomId, path, nodeId) {
    return createRoomPathKey(roomId, path) + ", node:" + nodeId;
}
function existsKeyInStorage(key) {
    return new Promise(function (resolve, reject) {
    });
}
function createRoom(request, response) {
    var params = request.body;
    params.description = isString_1.isString(params.description) ? params.description : "";
    params.public = isBoolean_1.isBoolean(params.public) ? params.public : true;
    params.expire = isNumber_1.isNumber(params.expire) ? params.expire : EXPIRE_DURATION_IN_SECONDS;
}
exports.createRoom = createRoom;
function getRoom(request, response) {
}
exports.getRoom = getRoom;
function ensureNodeIdInRoom(nodeId, roomId) {
    return new Promise(function (resolve, reject) {
    });
}
function ensureFileIdInRoom(fileId, roomId) {
    return new Promise(function (resolve, reject) {
    });
}
function getRemote(roomId, path, nodeId) {
    return new Promise(function (resolve, reject) {
    });
}
function setRemoteInStorage(roomId, path, nodeId, remote, callback) {
}
function ensureRemote(nodeId, path, roomId) {
    return new Promise(function (resolve, reject) {
        var remoteKey = createRemoteKey(roomId, path, nodeId);
        existsKeyInStorage(remoteKey)
            .then(function (exists) {
            asserts_1.mustBeTruthy(isBoolean_1.isBoolean(exists), "exists must be a boolean");
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
                var remote = new MwRemote_1.MwRemote();
                setRemoteInStorage(roomId, path, nodeId, remote, function (err) {
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
function createDocumentInStorage(roomId, path, text, callback) {
}
function getDocumentFromStorage(roomId, path, callback) {
}
function deleteDocumentFromStorage(roomId, path, callback) {
}
function deleteDocument(fromId, roomId, path, change, remote) {
    return new Promise(function (resolve, reject) {
        deleteDocumentFromStorage(roomId, path, function (err) {
            if (!err) {
                if (typeof change.m === 'number') {
                    remote.discardActionsLe(fromId, change.m);
                }
                remote.discardChanges(fromId);
                resolve(change.a.c);
            }
            else {
                reject(err);
            }
        });
    });
}
function getNodes(roomId) {
    return new Promise(function (resolve, reject) {
    });
}
function getPaths(roomId) {
    return new Promise(function (resolve, reject) {
    });
}
function captureFile(roomId, path, nodeId, remote) {
    return new Promise(function (resolve, reject) {
        var shadow = remote.shadow;
        getDocumentFromStorage(roomId, path, function (err, editor) {
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
                setRemoteInStorage(roomId, path, nodeId, remote, function (err) {
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
                        createDocumentInStorage(roomId, path, text, function (err, unused) {
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
                        getDocumentFromStorage(roomId, path, function (err, doc) {
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
                    outstanding.push(deleteDocument(fromId, roomId, path, change, remote));
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
                .then(function (changes) {
                setRemoteInStorage(roomId, fileId, fromId, remote, function (err) {
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
}
exports.destroyRoom = destroyRoom;
//# sourceMappingURL=index.js.map