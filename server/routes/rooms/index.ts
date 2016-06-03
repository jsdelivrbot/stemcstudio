import * as express from 'express';
import * as redis from 'redis';
import isBoolean from '../../utils/isBoolean';
import isNumber from '../../utils/isNumber';
import isString from '../../utils/isString';
import RoomParams from './RoomParams';
import Room from './Room';
import ServerWorkspace from './ServerWorkspace';
import uniqueId from './uniqueId';
import MwBroadcast from '../../synchronization/MwBroadcast';
import MwEdit from '../../synchronization/MwEdit';
import MwNode from '../../synchronization/MwNode';
import FzNode from '../../synchronization/ds/FzNode';

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
    const sNode = new MwNode(roomId, new ServerWorkspace());
    // We could set a few other bits of information (description, public, expire, created_at, updated_at)
    // We don't literally shrink the node down to nothing, but we do get a JSON stringable form.
    // Idea: Use JSON.stringify(this, null, 2) to elucidate the interfaces?
    const value: FzNode = sNode.dehydrate();

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
    client.get(roomKey, function(err, reply) {
        if (!err) {
            // const value: FzNode = JSON.parse(reply);
            // The value part does not have the id property, so we patch that in.
            // const sNode = new MwNode(roomId, new ServerWorkspace());
            // sNode.rehydrate(value);
            const room: Room = {
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

export function setEdits(edits: MwEdit[], callback: (err: any, broadcast: MwBroadcast) => any) {
    // console.log(`setEdits(edits: MwEdit[]), edits = ${JSON.stringify(edits, null, 2)}`);
    // TODO: Create envelope for the edits so that we don't need to loop?
    const iLen = edits.length;
    for (let i = 0; i < iLen; i++) {
        const edit = edits[i];
        // const nodeId = edit.s;
        const roomId = edit.t;
        const roomKey = createRoomKey(roomId);
        client.get(roomKey, function(err, reply) {
            if (!err) {
                const before: FzNode = JSON.parse(reply);
                // console.log(`BEFORE: ${nodeId} => ${JSON.stringify(before, null, 2)}`);
                const sNode = new MwNode(roomId, new ServerWorkspace());
                sNode.rehydrate(before);
                sNode.setEdits(edits);
                // Create response messages for all clients.
                const broadcast: MwBroadcast = sNode.getBroadcast();
                const after: FzNode = sNode.dehydrate();
                // console.log(`AFTER: ${nodeId} => ${JSON.stringify(after, null, 2)}`);
                client.set(roomKey, JSON.stringify(after), function(err: Error, reply: any) {
                    callback(err, broadcast);
                });
            }
            else {
                callback(err, void 0);
            }
        });
    }
}
