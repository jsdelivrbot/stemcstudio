import * as express from 'express';
import * as redis from 'redis';
import {mustBeTruthy} from '../../synchronization/asserts';
import isBoolean from '../../utils/isBoolean';
import isNumber from '../../utils/isNumber';
import isString from '../../utils/isString';
import RoomParams from './RoomParams';
import Room from './Room';
// import ServerWorkspace from './ServerWorkspace';
import uniqueId from './uniqueId';
import RoomValue from './RoomValue';
import DMP from '../../synchronization/DMP';
import Patch from '../../synchronization/Patch';
import MwBroadcast from '../../synchronization/MwBroadcast';
import MwEditor from '../../synchronization/MwEditor';
import MwEdits from '../../synchronization/MwEdits';
import MwRemote from '../../synchronization/MwRemote';
import MwChange from '../../synchronization/MwChange';
import MwShadow from '../../synchronization/MwShadow';
// import MwUnit from '../../synchronization/MwUnit';
// import FzNode from '../../synchronization/ds/FzNode';

const TEN_MINUTES_IN_SECONDS = 600;

const dmp = new DMP();

const client = redis.createClient();

client.on('ready', function(err) {
    console.log("Redis connection has been established.");
});

client.on('connect', function(err) {
    console.log("Redis stream is connected to the server.");
});

client.on('reconnecting', function(err) {
    console.log("Trying to reconnect to the Redis server after losing the connection.");
});

client.on('error', function(err) {
    console.log("Error " + err);
});

client.on('warning', function(err) {
    console.log("Warning " + err);
});

client.on('end', function(err) {
    console.log("Established Redis server connection has been closed.");
});

function createRoomKey(roomId: string): string {
    return `room:${roomId}`;
}

function createRoomPropertyKey(roomId: string, name: string): string {
    return `${createRoomKey(roomId)}@${name}`;
}

function createUnitKey(roomId: string, path: string): string {
    return `${createRoomKey(roomId)}, path:${path}`;
}

function createUnitPropertyKey(roomId: string, path: string, name: string): string {
    return `${createUnitKey(roomId, path)}@${name}`;
}

function createRemoteKey(roomId: string, path: string, nodeId: string): string {
    return `${createUnitKey(roomId, path)}, node:${nodeId}`;
}

/*
function inspectMwUnit(fileName: string, unit: MwUnit) {
    // console.lg(fileName);
    const frozen = unit.dehydrate();
    const remotes = frozen.k;
    const nodeIds = Object.keys(remotes);
    for (let i = 0; i < nodeIds.length; i++) {
        const nodeId = nodeIds[i];
        const remote = remotes[nodeId];
        const edits = remote.e;
        const shadow = remote.s;
        // const backup = remote.b;
        const n = shadow.n;
        const m = shadow.m;
        const text = shadow.t;
        const happy = shadow.h;
        // console.lg(`Remote ${nodeId}`);
        // console.lg(`n: ${n}, m: ${m}, happy: ${happy}, text: ${text}`);
        // console.lg(`edits: ${JSON.stringify(edits, null, 2)}`);
    }
    unit.rehydrate(frozen);
}
*/

/**
 * Creates a room for collaborating.
 */
export function createRoom(request: express.Request, response: express.Response): void {

    const params: RoomParams = request.body;

    // console.lg(`createRoom POST ${JSON.stringify(params, null, 2)}`);

    // Apply default values to the parameters.
    params.description = isString(params.description) ? params.description : "";
    params.public = isBoolean(params.public) ? params.public : true;
    params.expire = isNumber(params.expire) ? params.expire : TEN_MINUTES_IN_SECONDS;

    /**
     * The room identifier defaults to 8 digits long.
     */
    const roomId = uniqueId();
    const roomKey = createRoomKey(roomId);

    //
    // Create a node and then persist it to redis.
    // Every time we want to interact with the room we hydrate the node from redis.
    //
    // const sNode = new MwNode(roomId, new ServerWorkspace());
    // We could set a few other bits of information (description, public, expire, created_at, updated_at)

    // TODO: It might be cheaper, CPU-wise, to operate directly on the FzNode using functional
    // programming rather than creating mutable objects. It might also be worth considering
    // computations that can be suspended until the next tick.
    const value: RoomValue = {
        description: params.description,
        public: params.public,
        units: {}
    };

    client.set(roomKey, JSON.stringify(value), function(err: Error, reply: any) {
        if (!err) {
            // 600 seconds is 10 minutes.
            client.expire(roomKey, params.expire, function(err: Error, reply: any) {
                if (!err) {
                    const room: Room = {
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

export function getRoom(request: express.Request, response: express.Response): void {
    const params: Room = request.params;
    // console.lg(`getRoom GET ${JSON.stringify(params, null, 2)}`);
    const roomId = params.id;
    const roomKey = createRoomKey(roomId);
    client.get(roomKey, function(err: Error, reply: string) {
        if (!err) {
            redis.print(err, reply);
            console.log(`reply: ${typeof reply} => ${JSON.stringify(reply, null, 2)}`);
            // TODO: Do we use more fine-grained objects in redis
            // to reduce the CPU cost or parsing and serializing?
            const value: RoomValue = JSON.parse(reply);
            if (value) {
                // The value part does not have the id property, so we patch that in.
                // const sNode = new MwNode(roomId, new ServerWorkspace());
                // sNode.rehydrate(value);
                const room: Room = {
                    id: roomId,
                    description: value.description,
                    public: value.public
                };
                response.status(200).send(room);
            }
            else {
                response.status(404).send(new Error(`Something is rotten in Denmark: ${roomId}`));
            }
        }
        else {
            response.status(404).send(err);
        }
    });
}

function ensurePathKey(roomId: string, path: string, callback: (err: Error) => any): void {
    console.log(`ensurePathKey(${roomId}, ${path})`);
    const paths = createRoomPropertyKey(roomId, 'paths');
    client.sismember([paths, path], function(reason: Error, exists: number) {
        if (!reason) {
            mustBeTruthy(isNumber(exists), `exists must be a number`);
            if (exists > 0) {
                callback(void 0);
            }
            else {
                client.sadd([paths, path], function(reason: Error, reply: any) {
                    if (!reason) {
                        client.expire(paths, TEN_MINUTES_IN_SECONDS, function(reason: Error, reply: any) {
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
            callback(new Error(`Unable to determine whether path ${path} exists: ${reason}`));
        }
    });
}

/**
 * Ensures that the remote is being tracked at the unit level.
 */
function ensureRemoteKey(roomId: string, path: string, nodeId: string, callback: (err: Error) => any) {
    console.log(`ensureRemoteKey(${roomId}, ${path}, ${nodeId})`);
    ensurePathKey(roomId, path, function(err: Error) {
        if (!err) {
            const remotes = createUnitPropertyKey(roomId, path, 'remotes');
            client.sismember([remotes, nodeId], function(reason: Error, exists: number) {
                if (!reason) {
                    mustBeTruthy(isNumber(exists), `exists must be a number`);
                    if (exists > 0) {
                        callback(void 0);
                    }
                    else {
                        client.sadd([remotes, nodeId], function(reason: Error, reply: any) {
                            if (!reason) {
                                client.expire(remotes, TEN_MINUTES_IN_SECONDS, function(reason: Error, reply: any) {
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
                    callback(new Error(`Unable to determine whether remote ${nodeId} exists: ${reason}`));
                }
            });
        }
        else {
            callback(err);
        }
    });
}

function getRemote(roomId: string, path: string, nodeId: string, callback: (err: Error, remote: MwRemote) => any): void {
    console.log(`getRemote(${roomId}, ${path}, ${nodeId})`);
    const key = createRemoteKey(roomId, path, nodeId);
    client.get(key, function(err: Error, remoteText: string) {
        if (!err) {
            const remote = new MwRemote();
            remote.rehydrate(JSON.parse(remoteText));
            callback(void 0, remote);
        }
        else {
            callback(new Error(), void 0);
        }
    });
}

function setRemote(roomId: string, path: string, nodeId: string, remote: MwRemote, callback: (err: Error) => any) {
    console.log(`updateRemote(${roomId}, ${path}, ${nodeId})`);
    const key = createRemoteKey(roomId, path, nodeId);
    const dehydrated = remote.dehydrate();
    const remoteText = JSON.stringify(dehydrated);
    client.set(key, remoteText, function(err: Error, replay: any) {
        callback(err);
    });
}

/**
 * Ensures that we have an object representing the remote.
 */
function ensureRemote(roomId: string, path: string, nodeId: string, callback: (err: Error, remote: MwRemote) => any) {
    console.log(`ensureRemote(${roomId}, ${path}, ${nodeId})`);
    const key = createRemoteKey(roomId, path, nodeId);
    client.exists(key, function(err: Error, exists: number) {
        if (!err) {
            mustBeTruthy(isNumber(exists), `exists must be a number`);
            if (exists > 0) {
                getRemote(roomId, path, nodeId, callback);
            }
            else {
                const remote = new MwRemote();
                setRemote(roomId, path, nodeId, remote, function(err: Error) {
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

class RedisEditor implements MwEditor {
    private refCount = 1;
    private key: string;
    constructor(private roomId: string, private path: string) {
        // Do nothing yet.
        this.key = createUnitPropertyKey(this.roomId, this.path, 'editor');
    }
    getText(callback: (err: Error, text: string) => any): void {
        client.get(this.key, function(err: Error, reply: string) {
            callback(err, reply);
        });
    }
    setText(text: string, callback: (err: Error) => any): void {
        client.set(this.key, text, function(err, reply) {
            callback(err);
        });
    }
    patch(patches: Patch[], callback: (err: Error, flags: boolean[]) => any): void {
        this.getText((err, oldText) => {
            const result = dmp.patch_apply(patches, oldText);
            const newText = <string>result[0];
            const flags = <boolean[]>result[1];
            // Set the new text only if there is a change to be made.
            if (oldText !== newText) {
                // The following will probably destroy any cursor or selection.
                // Widgets with cursors should override and patch more delicately.
                this.setText(newText, function(err: Error) {
                    callback(err, flags);
                });
            }
            else {
                callback(void 0, flags);
            }
        });
    }
    release(): number {
        this.refCount--;
        return this.refCount;
    }
}

function createDocument(roomId: string, path: string, text: string, callback: (err: Error, editor: MwEditor) => any) {
    console.log(`createDocument(${roomId}, ${path})`);
    const editorKey = createUnitPropertyKey(roomId, path, 'editor');
    client.set(editorKey, text, function(err, reply) {
        const editor = new RedisEditor(roomId, path);
        callback(err, editor);
        editor.release();
    });
}

function getDocument(roomId: string, path: string, callback: (err: Error, editor: MwEditor) => any) {
    console.log(`getDocument(${roomId}, ${path})`);
    const editorKey = createUnitPropertyKey(roomId, path, 'editor');
    client.get(editorKey, function(err, reply) {
        const editor = new RedisEditor(roomId, path);
        callback(err, editor);
        editor.release();
    });
}

function deleteDocument(roomId: string, path: string, callback: (err: Error) => any) {
    console.log(`deleteDocument(${roomId}, ${path})`);
    const editorKey = createUnitPropertyKey(roomId, path, 'editor');
    client.del(editorKey, function(err, reply) {
        callback(err);
    });
}

function getPaths(roomId: string, callback: (err: Error, paths: string[]) => any): void {
    const paths = createRoomPropertyKey(roomId, 'paths');
    client.smembers(paths, function(err: Error, reply: string[]) {
        console.log(`paths => ${JSON.stringify(reply, null, 2)}`);
        callback(err, reply);
    });
}

function getRemoteNodeIds(roomId: string, path: string, callback: (err: Error, nodeIds: string[]) => any): void {
    const remotes = createUnitPropertyKey(roomId, path, 'remotes');
    client.smembers(remotes, function(err: Error, reply: string[]) {
        console.log(`members => ${JSON.stringify(reply, null, 2)}`);
        callback(err, reply);
    });
}

function captureFile(roomId: string, path: string, nodeId: string, remote: MwRemote, callback: (err: Error, change: MwChange) => any): void {
    const shadow: MwShadow = remote.shadow;
    getDocument(roomId, path, function(err: Error, editor: MwEditor) {
        if (editor) {
            editor.getText(function(err: Error, text: string) {
                if (!err) {
                    if (shadow) {
                        if (shadow.happy) {
                            callback(void 0, shadow.createDiffTextChange(text));
                        }
                        else {
                            if (remote.containsRawAction(nodeId, text)) {
                                // Ignore
                                callback(void 0, void 0);
                            }
                            else {
                                // The last delta postback from the server to this shareObj didn't match.
                                // Send a full text dump to get back in sync.  This will result in any
                                // changes since the last postback being wiped out. :(
                                // Notice that updating the shadow text and incrementing the local version happens BEFORE.
                                callback(void 0, shadow.createFullTextChange(text, true));
                            }
                        }
                    }
                    else {
                        const shadow = remote.ensureShadow();
                        callback(void 0, shadow.createFullTextChange(text, true));
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

function getBroadcast(roomId: string, path: string, callback: (err: Error, broadcast: MwBroadcast) => any): void {
    console.log(`getBroadcast(room=${roomId}, path=${path})`);
    getRemoteNodeIds(roomId, path, function(err: Error, nodeIds: string[]) {
        if (!err) {
            const iLen = nodeIds.length;
            const outstanding: Promise<{ nodeId: string, edits: MwEdits }>[] = [];
            for (let i = 0; i < iLen; i++) {
                const nodeId = nodeIds[i];
                outstanding.push(new Promise<{ nodeId: string, edits: MwEdits }>(function(resolve, reject) {
                    getRemote(roomId, path, nodeId, function(err: Error, remote: MwRemote) {
                        if (!err) {
                            captureFile(roomId, path, nodeId, remote, function(err: Error, change: MwChange) {
                                if (!err) {
                                    remote.addChange(nodeId, change);
                                    const edits = remote.getEdits(nodeId);
                                    console.log(`nodeId=${nodeId} => ${JSON.stringify(edits, null, 2)}`);
                                    setRemote(roomId, path, nodeId, remote, function(err: Error) {
                                        if (!err) {
                                            resolve({ nodeId, edits });
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
            }
            // tsc v1.8.10 has problems with this! Visual Studio Code seems OK without the casting to any[].
            // I'd like to either have the type of nodeEdits inferred or explicit.
            Promise.all(outstanding).then(function(nodeEdits: any[]) {
                console.log(`nodeEdits => ${JSON.stringify(nodeEdits, null, 2)}`);
                const broadcast: MwBroadcast = {};
                for (let i = 0; i < nodeEdits.length; i++) {
                    const nodeEdit = nodeEdits[i];
                    broadcast[nodeEdit.nodeId] = nodeEdit.edits;
                }
                console.log(`broadcast => ${JSON.stringify(broadcast, null, 2)}`);
                callback(void 0, broadcast);
            }).catch(function(err) {
                callback(new Error(""), void 0);
            });
        }
        else {
            callback(err, void 0);
        }
    });
}

/**
 * Setting edits on a pre-file basis.
 * @param nodeId The identifier of the room that the edits came from.
 * @param roomId The identifier of the room that the edits are going to.
 * @param path
 */
export function setEdits(nodeId: string, roomId: string, path: string, edits: MwEdits, callback: (err: Error, data: { roomId: string; path: string; broadcast: MwBroadcast }) => any) {
    console.log(`setEdits('${roomId}', '${path}'), from '${nodeId}'.`);
    ensureRemoteKey(roomId, path, nodeId, function(err: Error) {
        if (!err) {
            ensureRemote(roomId, path, nodeId, (err: Error, remote: MwRemote) => {
                if (!err) {
                    const iLen = edits.x.length;
                    const outstanding: Promise<string>[] = [];
                    for (let i = 0; i < iLen; i++) {
                        const change = edits.x[i];
                        const action = change.a;
                        if (action) {
                            switch (action.c) {
                                case 'R': {
                                    outstanding.push(new Promise<string>(function(resolve, reject) {
                                        const text = decodeURI(<string>action.x);
                                        createDocument(roomId, path, text, function(err: Error, unused: MwEditor) {
                                            if (!err) {
                                                const shadow = remote.ensureShadow();
                                                // The action local version becomes our remote version.
                                                shadow.updateRaw(text, action.n);
                                                // This looks a bit wierd, only because we are in a client server environment.
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
                                case 'r': {
                                    const text = decodeURI(<string>action.x);
                                    const shadow = remote.shadow;
                                    // const shadow = link.ensureShadow(change.f, this.useBackupShadow);
                                    // The action local version becomes our remote version.
                                    shadow.updateRaw(text, action.n);
                                    remote.discardChanges(nodeId);
                                }
                                    break;
                                case 'D':
                                case 'd': {
                                    outstanding.push(new Promise<any>(function(resolve, reject) {
                                        getDocument(roomId, path, function(err: Error, doc: MwEditor) {
                                            if (!err) {
                                                const shadow = remote.shadow;
                                                const backup = remote.backup;
                                                // The change remote version becomes our local version.
                                                // The action local version becomes our remote version.
                                                remote.patchDelta(nodeId, doc, action.c, <string[]>action.x, change.m, action.n, function(err: Error) {
                                                    if (!err) {
                                                        backup.copy(shadow);
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
                                case 'n': {
                                    outstanding.push(new Promise<any>(function(resolve, reject) {
                                        deleteDocument(roomId, path, function(err: Error) {
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
                                    // console.lg(`action.c => ${action.c}`);
                                }
                            }
                        }
                        else {
                            if (typeof change.m === 'number') {
                                remote.discardActionsLe(nodeId, change.m);
                            }
                        }
                    }
                    console.log(`outstanding.length => ${outstanding.length}`);
                    Promise.all(outstanding).then(function(unused) {
                        setRemote(roomId, path, nodeId, remote, function(err: Error) {
                            if (!err) {
                                getBroadcast(roomId, path, function(err: Error, broadcast: MwBroadcast) {
                                    if (!err) {
                                        callback(err, { roomId, path, broadcast });
                                    }
                                    else {
                                        callback(err, void 0);
                                    }
                                });
                            }
                            else {
                                console.log(`Unable to update remote 0 => ${err.message}, 1 => ${err}, 2 => ${JSON.stringify(err, null, 2)}`);
                                callback(err, void 0);
                            }
                        });
                    }).catch(function(err) {
                        console.log(`Unable to apply the edits: 1 => ${err}, 2 => ${JSON.stringify(err, null, 2)}`);
                        callback(new Error(`Unable to apply the edits: ${err}`), void 0);
                    });
                }
                else {
                    callback(new Error(`Unable to ensure remote (room=${roomId}, path=${path}, nodeId=${nodeId}): ${err}`), void 0);
                }
            });
        }
        else {
            callback(new Error(`Unable to ensureRemoteKey(room=${roomId}, path=${path}, nodeId=${nodeId}): ${err}`), void 0);
        }
    });
}

/**
 * After a user (remote room) has joined the room, they will require the edits that generate their workspace.
 */
export function getEdits(nodeId: string, roomId: string, callback: (err, data: { fromId: string, roomId: string, files: { [path: string]: MwEdits } }) => any) {
    getPaths(roomId, function(err: Error, paths: string[]) {
        const outstanding: Promise<{ path: string, edits: MwEdits }>[] = [];
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            outstanding.push(new Promise<{ path: string, edits: MwEdits }>(function(resolve, reject) {
                ensureRemote(roomId, path, nodeId, function(err: Error, remote: MwRemote) {
                    captureFile(roomId, path, nodeId, remote, function(err: Error, change: MwChange) {
                        if (!err) {
                            remote.addChange(nodeId, change);
                            const edits = remote.getEdits(nodeId);
                            console.log(`nodeId=${nodeId} => ${JSON.stringify(edits, null, 2)}`);
                            setRemote(roomId, path, nodeId, remote, function(err: Error) {
                                if (!err) {
                                    resolve({ path, edits });
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
        }
        // tsc v1.8.10 has problems with this! Visual Studio Code seems OK without the casting to any[].
        // I'd like to either have the type of pathEdits inferred or explicit.
        Promise.all(outstanding).then(function(pathEdits: /*{ path: string; edits: MwEdits }*/any[]) {
            const files: { [path: string]: MwEdits } = {};
            for (let i = 0; i < pathEdits.length; i++) {
                const pathEdit = <{ path: string; edits: MwEdits }>pathEdits[i];
                files[pathEdit.path] = pathEdit.edits;
            }
            // The roomId parameter is the `from` room because the broadcast contains all the `to` rooms.
            callback(void 0, { fromId: roomId, roomId: nodeId, files });
        }).catch(function(err) {
            callback(err, void 0);
        });
    });
    /*
        const roomKey = createRoomKey(roomId);
        client.get(roomKey, function(err, roomAsJSON: string) {
            if (!err) {
                const files: { [path: string]: MwEdits } = {};
                const room: RoomValue = JSON.parse(roomAsJSON);
                const paths = Object.keys(room.units);
                for (let i = 0; i < paths.length; i++) {
                    const path = paths[i];
                    const unit = new MwUnit(new ServerWorkspace());
                    const frozen = room.units[path];
                    if (frozen) {
                        unit.rehydrate(frozen);
                    }
                    const edits: MwEdits = unit.getEdits(fromId);
                    files[path] = edits;
                    room.units[path] = unit.dehydrate();
                }
                console.lg(`ROOM: ${roomId} => ${JSON.stringify(Object.keys(room.units), null, 2)}`);
                client.set(roomKey, JSON.stringify(room), function(err: Error, reply: string) {
                    // The roomId parameter is the `from` room because the broadcast contains all the `to` rooms.
                    callback(err, { fromId: roomId, roomId: fromId, files });
                });
            }
            else {
                callback(err, void 0);
            }
        });
    */
}

/**
 * Destrot the room by removing the (roomKey, value) pair from Redis.
 */
export function destroyRoom(request: express.Request, response: express.Response): void {
    const params: Room = request.params;
    // console.lg(`destroyRoom(${JSON.stringify(params, null, 2)})`);
    const roomId = params.id;
    const roomKey = createRoomKey(roomId);
    client.del(roomKey, function(err, reply) {
        if (!err) {
            // console.lg(reply);
            response.status(200).send({});
        }
        else {
            // console.lg(err);
            response.status(404).send({});
        }
    });
}
