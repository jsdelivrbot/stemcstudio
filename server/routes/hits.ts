import * as express from 'express';

let hits = 0;

export function count(req: express.Request, res: express.Response) {
    res.status(200).send({ hits });
}

export function registerHit(req: express.Request, res: express.Response) {
    hits += 1;
    res.status(200).send({ hits });
}