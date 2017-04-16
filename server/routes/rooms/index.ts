import { Request, Response } from 'express';
import * as redis from 'redis';
import * as url from 'url';
import { mustBeTruthy } from '../../synchronization/asserts';
import isBoolean from '../../utils/isBoolean';
import isNumber from '../../utils/isNumber';
import isString from '../../utils/isString';
import RoomParams from './RoomParams';
import Room from './Room';
import uniqueId from './uniqueId';
import RoomValue from './RoomValue';
import DMP from '../../synchronization/DMP';
import Patch from '../../synchronization/Patch';
import { ACTION_RAW_OVERWRITE, ACTION_RAW_SYNCHONLY } from '../../synchronization/MwAction';
import { ACTION_DELTA_OVERWRITE, ACTION_DELTA_MERGE } from '../../synchronization/MwAction';
import { ACTION_NULLIFY_UPPERCASE, ACTION_NULLIFY_LOWERCASE } from '../../synchronization/MwAction';
import MwBroadcast from '../../synchronization/MwBroadcast';
import MwEditor from '../../synchronization/MwEditor';
import MwEdits from '../../synchronization/MwEdits';
import MwRemote from '../../synchronization/MwRemote';
import MwChange from '../../synchronization/MwChange';
import MwShadow from '../../synchronization/MwShadow';

/**
 * The expiration duration for a collaboration is set to 1 hour.
 */
const EXPIRE_DURATION_IN_SECONDS = 3600;

const ROOM_PATHS_PROPERTY_NAME = 'paths';
const ROOM_PATH_CONTENT_PROPERTY_NAME = 'content';
const ROOM_PATH_REMOTES_PROPERTY_NAME = 'remotes';

const dmp = new DMP();

let client: redis.RedisClient;
if (process.env.REDISTOGO_URL) {
    const rtg = url.parse(process.env.REDISTOGO_URL);
    const port = rtg.port as string;
    client = redis.createClient(port, rtg.hostname);
    const auth = rtg.auth as string;
    client.auth(auth.split(":")[1]);
}
else {
    client = redis.createClient();
}

client.on('ready', function ready(err: any) {
    if (err) {
        console.warn(`Redis 'ready' failed. ${err}`);
    }
    else {
        console.warn("Redis is 'ready'.");
    }
});

client.on('connect', function connect(err: any) {
    if (err) {
        console.warn(`Redis could not connect to the server. ${err}`);
    }
    else {
        console.warn("Redis is connected to the server.");
    }
});

client.on('reconnecting', function reconnecting(err: any) {
    if (err) {
        console.log("Trying to reconnect to the Redis server after losing the connection...");
    }
    else {
        console.log("Trying to reconnect to the Redis server after losing the connection...");
    }
});

client.on('error', function error(err: any) {
    console.log("Error " + err);
});

client.on('warning', function warning(err: any) {
    console.log("Warning " + err);
});

client.on('end', function end(err: any) {
    console.log("Established Redis server connection has been closed.");
});

function createRoomKey(roomId: string): string {
    return `room:${roomId}`;
}

function createRoomPropertyKey(roomId: string, name: string): string {
    return `${createRoomKey(roomId)}@${name}`;
}

function createRoomPathKey(roomId: string, path: string): string {
    return `${createRoomKey(roomId)}, path:${path}`;
}

function createRoomPathPropertyKey(roomId: string, path: string, name: string): string {
    return `${createRoomPathKey(roomId, path)}@${name}`;
}

function createRoomPathRemoteKey(roomId: string, path: string, nodeId: string): string {
    return `${createRoomPathKey(roomId, path)}, node:${nodeId}`;
}

/**
 * Creates a room for collaborating.
 * TODO: Refactor to split redis from Express.
 */
export function createRoom(request: Request, response: Response): void {

    const params: RoomParams = request.body;

    // Apply default values to the parameters.
    params.description = isString(params.description) ? params.description : "";
    params.public = isBoolean(params.public) ? params.public : true;
    params.expire = isNumber(params.expire) ? params.expire : EXPIRE_DURATION_IN_SECONDS;

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
        owner: params.owner,
        description: params.description,
        public: params.public,
        units: {}
    };

    client.set(roomKey, JSON.stringify(value), function (err: Error, reply: any) {
        if (!err) {
            client.expire(roomKey, EXPIRE_DURATION_IN_SECONDS, function (err: Error, reply: any) {
                if (!err) {
                    const room: Room = {
                        id: roomId,
                        owner: params.owner,
                        description: params.description as string,
                        public: params.public as boolean
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

/**
 * TODO: Refactor to split redis from Express.
 */
export function getRoom(request: Request, response: Response): void {
    const roomParam = request.params as Room;
    const roomId = roomParam.id;
    const roomKey = createRoomKey(roomId);
    client.get(roomKey, function (err: Error, reply: string) {
        if (!err) {
            redis.print(err, reply);
            // TODO: Do we use more fine-grained objects in redis
            // to reduce the CPU cost or parsing and serializing?
            const value = JSON.parse(reply) as RoomValue;
            if (value) {
                // The value part does not have the id property, so we patch that in.
                // const sNode = new MwNode(roomId, new ServerWorkspace());
                // sNode.rehydrate(value);
                const room: Room = {
                    id: roomId,
                    owner: value.owner,
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

/**
 * Ensures that the specified path is part of this room (workspace).
 */
function ensurePathKey(roomId: string, path: string, callback: (err: Error | null | undefined) => any): void {
    const paths = createRoomPropertyKey(roomId, ROOM_PATHS_PROPERTY_NAME);
    client.sismember([paths, path], function (reason: Error, exists: number) {
        if (!reason) {
            mustBeTruthy(isNumber(exists), `exists must be a number`);
            if (exists > 0) {
                callback(void 0);
            }
            else {
                client.sadd([paths, path], function (reason: Error, reply: any) {
                    if (!reason) {
                        client.expire(paths, EXPIRE_DURATION_IN_SECONDS, function (reason: Error, reply: any) {
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
function ensureRemoteKey(roomId: string, path: string, nodeId: string, callback: (err: Error | null | undefined) => any) {
    ensurePathKey(roomId, path, function (err: Error) {
        if (!err) {
            const remotes = createRoomPathPropertyKey(roomId, path, ROOM_PATH_REMOTES_PROPERTY_NAME);
            client.sismember([remotes, nodeId], function (reason: void | Error, exists: number) {
                if (!reason) {
                    mustBeTruthy(isNumber(exists), `exists must be a number`);
                    if (exists > 0) {
                        callback(void 0);
                    }
                    else {
                        client.sadd([remotes, nodeId], function (reason: Error, reply: any) {
                            if (!reason) {
                                client.expire(remotes, EXPIRE_DURATION_IN_SECONDS, function (reason: Error, reply: any) {
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

function getRemote(roomId: string, path: string, nodeId: string, callback: (err: Error | null | undefined, remote?: MwRemote) => any): void {
    const remoteKey = createRoomPathRemoteKey(roomId, path, nodeId);
    client.get(remoteKey, function (err: Error, remoteText: string) {
        if (!err) {
            const remote = new MwRemote();
            remote.rehydrate(JSON.parse(remoteText));
            callback(void 0, remote);
        }
        else {
            callback(new Error(`Unable to getRemote(roomId = ${roomId}, path = ${path}, nodeId = ${nodeId})`));
        }
    });
}

/**
 * Serializes the remote using the key consisting of roomId, path, and nodeId.
 */
function setRemote(roomId: string, path: string, nodeId: string, remote: MwRemote, callback: (err: Error) => any) {
    const remoteKey = createRoomPathRemoteKey(roomId, path, nodeId);
    const dehydrated = remote.dehydrate();
    const remoteText = JSON.stringify(dehydrated);
    client.set(remoteKey, remoteText, function (err: Error, reply: any) {
        client.expire(remoteKey, EXPIRE_DURATION_IN_SECONDS, function expire(err: Error, reply: any) {
            callback(err);
        });
    });
}

/**
 * Ensures that we have an object representing the remote.
 */
function ensureRemote(roomId: string, path: string, nodeId: string, callback: (err: Error, remote?: MwRemote) => any) {
    const key = createRoomPathRemoteKey(roomId, path, nodeId);
    client.exists(key, function (err: Error, exists: number) {
        if (!err) {
            mustBeTruthy(isNumber(exists), `exists must be a number`);
            if (exists > 0) {
                getRemote(roomId, path, nodeId, callback);
            }
            else {
                const remote = new MwRemote();
                setRemote(roomId, path, nodeId, remote, function (err: Error) {
                    if (!err) {
                        getRemote(roomId, path, nodeId, callback);
                    }
                    else {
                        callback(err);
                    }
                });
            }
        }
        else {
            callback(err);
        }
    });
}

class RedisEditor implements MwEditor {
    private refCount = 1;
    private contentKey: string;
    constructor(private roomId: string, private path: string) {
        // Do nothing yet.
        this.contentKey = createRoomPathPropertyKey(this.roomId, this.path, ROOM_PATH_CONTENT_PROPERTY_NAME);
    }
    getText(callback: (err: Error, text: string) => any): void {
        client.get(this.contentKey, function (err: Error, reply: string) {
            callback(err, reply);
        });
    }
    setText(text: string, callback: (err: Error) => any): void {
        client.set(this.contentKey, text, (err, reply) => {
            client.expire(this.contentKey, EXPIRE_DURATION_IN_SECONDS, function (err: Error, reply: any) {
                callback(err);
            });
        });
    }
    patch(patches: Patch[], callback: (err: Error | null | undefined, flags: boolean[]) => any): void {
        this.getText((err, oldText) => {
            const result = dmp.patch_apply(patches, oldText);
            const newText = <string>result[0];
            const flags = <boolean[]>result[1];
            // Set the new text only if there is a change to be made.
            if (oldText !== newText) {
                // The following will probably destroy any cursor or selection.
                // Widgets with cursors should override and patch more delicately.
                this.setText(newText, function (err: Error) {
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
    const contentKey = createRoomPathPropertyKey(roomId, path, ROOM_PATH_CONTENT_PROPERTY_NAME);
    client.set(contentKey, text, (err, reply) => {
        client.expire(contentKey, EXPIRE_DURATION_IN_SECONDS, function (err: Error, reply: any) {
            const editor = new RedisEditor(roomId, path);
            callback(err, editor);
            editor.release();
        });
    });
}

function getDocument(roomId: string, path: string, callback: (err: void | Error, editor: MwEditor) => any) {
    const contentKey = createRoomPathPropertyKey(roomId, path, ROOM_PATH_CONTENT_PROPERTY_NAME);
    client.get(contentKey, function (err, reply) {
        const editor = new RedisEditor(roomId, path);
        callback(err, editor);
        editor.release();
    });
}

function deleteDocument(roomId: string, path: string, callback: (err: Error) => any) {
    const contentKey = createRoomPathPropertyKey(roomId, path, ROOM_PATH_CONTENT_PROPERTY_NAME);
    client.del(contentKey, function (err: Error, reply: any) {
        callback(err);
    });
}

/**
 * Returns the file paths for this room (the files that are in the workspace).
 * @param roomId 
 * @param callback 
 */
function getPaths(roomId: string, callback: (err: Error, paths: string[]) => void): void {
    const pathsKey = createRoomPropertyKey(roomId, ROOM_PATHS_PROPERTY_NAME);
    client.smembers(pathsKey, function (err: Error, paths: string[]) {
        callback(err, paths);
    });
}

/**
 * Determines all of the nodeIs that exists for the specified room and file path.
 */
function getRemoteNodeIds(roomId: string, path: string, callback: (err: Error, nodeIds: string[]) => void): void {
    const remotes = createRoomPathPropertyKey(roomId, path, ROOM_PATH_REMOTES_PROPERTY_NAME);
    client.smembers(remotes, function (err: Error, nodeIds: string[]) {
        callback(err, nodeIds);
    });
}

function captureFile(roomId: string, path: string, nodeId: string, remote: MwRemote, callback: (err: Error | null | undefined, change?: MwChange) => any): void {
    const shadow: MwShadow = remote.shadow;
    getDocument(roomId, path, function (err: Error, editor: MwEditor) {
        if (editor) {
            editor.getText(function (err: Error, text: string) {
                if (!err) {
                    if (shadow) {
                        if (shadow.happy) {
                            callback(void 0, shadow.createDiffTextChange(text));
                        }
                        else {
                            if (remote.containsRawAction(nodeId, text)) {
                                // Ignore
                                callback(void 0);
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
                    callback(new Error("Unable to get text from editor."));
                }
            });
        }
        else {
            callback(new Error("Must be an editor to capture a file."));
        }
    });
}

/**
 * 
 * @param roomId The node from which the broadcast is being made.
 * @param path The file for which the broadcast is required.
 * @param callback The callback function for the response.
 */
function getBroadcast(roomId: string, path: string, callback: (err: Error | null | undefined, broadcast?: MwBroadcast) => any): void {
    getRemoteNodeIds(roomId, path, function (err: Error, nodeIds: string[]) {
        if (!err) {
            const outstanding: Promise<{ nodeId: string, edits: MwEdits }>[] = [];
            for (const nodeId of nodeIds) {
                outstanding.push(new Promise<{ nodeId: string, edits: MwEdits }>(function (resolve, reject) {
                    getRemote(roomId, path, nodeId, function (err: Error, remote: MwRemote) {
                        if (!err) {
                            captureFile(roomId, path, nodeId, remote, function (err: Error, change: MwChange) {
                                if (!err) {
                                    remote.addChange(nodeId, change);
                                    const edits = remote.getEdits(nodeId);
                                    setRemote(roomId, path, nodeId, remote, function (err: Error) {
                                        if (!err) {
                                            resolve({ nodeId, edits });
                                        }
                                        else {
                                            reject(err);
                                        }
                                    });
                                }
                                else {
                                    callback(err);
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
            // I'd like to either have the type of nodeEdits inferred or explicit. (May need nodeEdits: any[] cast).
            Promise.all(outstanding)
                .then(function (nodeEdits) {
                    const broadcast: MwBroadcast = {};
                    for (const nodeEdit of nodeEdits) {
                        broadcast[nodeEdit.nodeId] = nodeEdit.edits;
                    }
                    callback(void 0, broadcast);
                })
                .catch(function (err) {
                    callback(new Error(`Unable to getBroadcast(room = ${roomId}, path = ${path}). Cause: ${err}`));
                });
        }
        else {
            callback(err);
        }
    });
}

/**
 * Setting edits on a per-file basis and asychronously return a broadcast.
 * This is exposed in order to support the socket room upload request (actually called 'edits').
 * @param nodeId The identifier of the room that the edits came from.
 * @param roomId The identifier of the room that the edits are going to.
 * @param path
 */
export function setEdits(fromId: string, roomId: string, path: string, edits: MwEdits, callback: (err: Error, data?: { roomId: string; path: string; broadcast: MwBroadcast }) => void): void {
    ensureRemoteKey(roomId, path, fromId, function (err: Error) {
        if (!err) {
            // TODO: SHould we be ensuring that there is a remote for all nodes associated with this room.
            ensureRemote(roomId, path, fromId, (err: Error, remote: MwRemote) => {
                if (!err) {
                    // Changes must be applied using promises because the remotes are in storage.
                    const outstanding: Promise<string>[] = [];
                    for (const change of edits.x) {
                        const action = change.a;
                        if (action) {
                            switch (action.c) {
                                case ACTION_RAW_OVERWRITE: {
                                    outstanding.push(new Promise<string>(function (resolve, reject) {
                                        const text = decodeURI(action.x as string);
                                        createDocument(roomId, path, text, function (err: Error, unused: MwEditor) {
                                            if (!err) {
                                                const shadow = remote.ensureShadow();
                                                // The action local version becomes our remote version.
                                                shadow.updateRaw(text, action.n);
                                                // This looks a bit wierd, only because we are in a client server environment.
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
                                case ACTION_RAW_SYNCHONLY: {
                                    const text = decodeURI(action.x as string);
                                    const shadow = remote.shadow;
                                    // const shadow = link.ensureShadow(change.f, this.useBackupShadow);
                                    // The action local version becomes our remote version.
                                    shadow.updateRaw(text, action.n);
                                    remote.discardChanges(fromId);
                                    break;
                                }
                                case ACTION_DELTA_OVERWRITE:
                                case ACTION_DELTA_MERGE: {
                                    outstanding.push(new Promise<any>(function (resolve, reject) {
                                        getDocument(roomId, path, function (err: Error, doc: MwEditor) {
                                            if (!err) {
                                                const shadow = remote.shadow;
                                                const backup = remote.backup;
                                                // The change remote version becomes our local version.
                                                // The action local version becomes our remote version.
                                                remote.patchDelta(fromId, doc, action.c, action.x as string[], change.m, action.n, function (err: Error) {
                                                    if (!err) {
                                                        backup.copy(shadow);
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
                                case ACTION_NULLIFY_UPPERCASE:
                                case ACTION_NULLIFY_LOWERCASE: {
                                    outstanding.push(new Promise<any>(function (resolve, reject) {
                                        deleteDocument(roomId, path, function (err: Error) {
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
                                    console.warn(`action.c => ${action.c}`);
                                }
                            }
                        }
                        else {
                            if (typeof change.m === 'number') {
                                remote.discardActionsLe(fromId, change.m);
                            }
                        }
                    }
                    Promise.all(outstanding)
                        .then(function (unused) {
                            setRemote(roomId, path, fromId, remote, function (err: Error) {
                                if (!err) {
                                    getBroadcast(roomId, path, function (err: Error, broadcast: MwBroadcast) {
                                        if (!err) {
                                            callback(err, { roomId, path, broadcast });
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
                            callback(new Error(`Unable to apply the edits: ${err}`), void 0);
                        });
                }
                else {
                    callback(new Error(`Unable to ensure remote (room=${roomId}, path=${path}, fromId=${fromId}): ${err}`));
                }
            });
        }
        else {
            callback(new Error(`Unable to ensureRemoteKey(room=${roomId}, path=${path}, fromId=${fromId}): ${err}`));
        }
    });
}

/**
 * After a user (remote room) has joined the room, they will require the edits that generate their workspace.
 * This is exposed in order to support the socket room 'download' request.
 */
export function getEdits(nodeId: string, roomId: string, callback: (err: any, data?: { fromId: string, roomId: string, files: { [path: string]: MwEdits } }) => any) {
    getPaths(roomId, function (err: Error, paths: string[]) {
        const outstanding: Promise<{ path: string, edits: MwEdits }>[] = [];
        for (const path of paths) {
            outstanding.push(new Promise<{ path: string, edits: MwEdits }>(function (resolve, reject) {
                ensureRemote(roomId, path, nodeId, function (err: Error, remote: MwRemote) {
                    captureFile(roomId, path, nodeId, remote, function (err: Error, change: MwChange) {
                        if (!err) {
                            remote.addChange(nodeId, change);
                            const edits = remote.getEdits(nodeId);
                            setRemote(roomId, path, nodeId, remote, function (err: Error) {
                                if (!err) {
                                    resolve({ path, edits });
                                }
                                else {
                                    reject(err);
                                }
                            });
                        }
                        else {
                            callback(err);
                        }
                    });
                });
            }));
        }
        // tsc v1.8.10 has problems with this! Visual Studio Code seems OK without the casting to any[].
        // I'd like to either have the type of pathEdits inferred or explicit.
        Promise.all(outstanding)
            .then(function (pathEdits: /*{ path: string; edits: MwEdits }*/any[]) {
                const files: { [path: string]: MwEdits } = {};
                for (let i = 0; i < pathEdits.length; i++) {
                    const pathEdit = <{ path: string; edits: MwEdits }>pathEdits[i];
                    files[pathEdit.path] = pathEdit.edits;
                }
                // The roomId parameter is the `from` room because the broadcast contains all the `to` rooms.
                callback(void 0, { fromId: roomId, roomId: nodeId, files });
            })
            .catch(function (err) {
                callback(err, void 0);
            });
    });
}

/**
 * Destroy the room by removing the (roomKey, value) pair from Redis.
 * This is exposed in order to support HTTP/REST using Express.
 * TODO: Refactor into a destroyRoom(room) function.
 */
export function destroyRoom(request: Request, response: Response): void {
    const room = request.params as Room;
    const roomId = room.id;
    const roomKey = createRoomKey(roomId);
    client.del(roomKey, function (err: any, reply: any) {
        if (!err) {
            response.status(200).send({});
        }
        else {
            response.status(404).send({});
        }
    });
}
