import * as express from 'express';
import * as redis from 'redis';
import isBoolean from '../../utils/isBoolean';
import isNumber from '../../utils/isNumber';
import isString from '../../utils/isString';
import RoomParams from './RoomParams';
import Room from './Room';
import ServerWorkspace from './ServerWorkspace';
import uniqueId from './uniqueId';
import RoomValue from './RoomValue';
import MwBroadcast from '../../synchronization/MwBroadcast';
import MwEdits from '../../synchronization/MwEdits';
import MwUnit from '../../synchronization/MwUnit';
// import FzNode from '../../synchronization/ds/FzNode';

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

function inspectUnit(fileName: string, unit: MwUnit) {
    console.log(fileName);
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
        console.log(`Remote ${nodeId}`);
        console.log(`n: ${n}, m: ${m}, happy: ${happy}, text: ${text}`);
        console.log(`edits: ${JSON.stringify(edits, null, 2)}`);
    }
    unit.rehydrate(frozen);
}

/**
 * Creates a room for collaborating.
 */
export function createRoom(request: express.Request, response: express.Response): void {

    const params: RoomParams = request.body;

    // console.log(`createRoom POST ${JSON.stringify(params, null, 2)}`);

    // Apply default values to the parameters.
    params.description = isString(params.description) ? params.description : "";
    params.public = isBoolean(params.public) ? params.public : true;
    params.expire = isNumber(params.expire) ? params.expire : 600;

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
                if (err) {
                    redis.print(err, reply);
                }
            });
            const room: Room = {
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

export function getRoom(request: express.Request, response: express.Response): void {
    const params: Room = request.params;
    // console.log(`getRoom GET ${JSON.stringify(params, null, 2)}`);
    const roomId = params.id;
    const roomKey = createRoomKey(roomId);
    client.get(roomKey, function(err, reply: string) {
        if (!err) {
            // TODO: Do we use more fine-grained objects in redis
            // to reduce the CPU cost or parsing and serializing?
            const value: RoomValue = JSON.parse(reply);
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
            redis.print(err, reply);
            response.status(404).send(err);
        }
    });
}

/**
 * Setting edits on a pre-file basis.
 * @param fromId The identifier of the room that the edits came from.
 * @param roomId The identifier of the room that the edits are going to.
 * @param fileName
 */
export function setEdits(fromId: string, roomId: string, fileName: string, edits: MwEdits, callback: (err: any, data: { roomId: string; fileName: string; broadcast: MwBroadcast }) => any) {
    console.log(`setEdits('${roomId}', '${fileName}'), from '${fromId}'.`);
    // TODO: Move towards more granular objects on Redis?
    // The roomId selects the correct room here on the server in Redis.
    const roomKey = createRoomKey(roomId);
    client.get(roomKey, function(err, reply: string) {
        if (!err) {
            const room: RoomValue = JSON.parse(reply);
            // console.log(`BEFORE: ${roomId} => ${JSON.stringify(room, null, 2)}`);
            const unit = new MwUnit(new ServerWorkspace());
            const frozen = room.units[fileName];
            if (frozen) {
                unit.rehydrate(frozen);
            }
            // The fromId lets the unit know where these edits came from.
            inspectUnit(fileName, unit);
            unit.setEdits(fromId, edits);
            inspectUnit(fileName, unit);
            const broadcast = unit.getBroadcast();
            inspectUnit(fileName, unit);
            room.units[fileName] = unit.dehydrate();
            // console.log(`AFTER: ${roomId} => ${JSON.stringify(room, null, 2)}`);
            client.set(roomKey, JSON.stringify(room), function(err: Error, reply: any) {
                // The roomId parameter is the `from` room because the broadcast contains all the `to` rooms.
                callback(err, { roomId, fileName, broadcast });
            });
        }
        else {
            callback(err, void 0);
        }
    });
}

/**
 * After a user (remote room) has joined the room, they will require the edits that generate their workspace.
 */
export function getEdits(fromId: string, roomId: string, callback: (err, data: { fromId: string, roomId: string, files: { [fileName: string]: MwEdits } }) => any) {

    const roomKey = createRoomKey(roomId);
    client.get(roomKey, function(err, reply: string) {
        if (!err) {
            const files: { [fileName: string]: MwEdits } = {};
            const room: RoomValue = JSON.parse(reply);
            const fileNames = Object.keys(room.units);
            for (let i = 0; i < fileNames.length; i++) {
                const fileName = fileNames[i];
                const unit = new MwUnit(new ServerWorkspace());
                const frozen = room.units[fileName];
                if (frozen) {
                    unit.rehydrate(frozen);
                }
                const edits: MwEdits = unit.getEdits(fromId);
                files[fileName] = edits;
                room.units[fileName] = unit.dehydrate();
            }
            client.set(roomKey, JSON.stringify(room), function(err: Error, reply: any) {
                // The roomId parameter is the `from` room because the broadcast contains all the `to` rooms.
                callback(err, { fromId: roomId, roomId: fromId, files });
            });
        }
        else {
            callback(err, void 0);
        }
    });

}

/**
 * Destrot the room by removing the (roomKey, value) pair from Redis.
 */
export function destroyRoom(request: express.Request, response: express.Response): void {
    const params: Room = request.params;
    console.log(`destroyRoom(${JSON.stringify(params, null, 2)})`);
    const roomId = params.id;
    const roomKey = createRoomKey(roomId);
    client.del(roomKey, function(err, reply) {
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
