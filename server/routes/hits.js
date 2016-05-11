"use strict";
var hits = 0;
function count(req, res) {
    res.status(200).send({ hits: hits });
}
exports.count = count;
function registerHit(req, res) {
    hits += 1;
    res.status(200).send({ hits: hits });
}
exports.registerHit = registerHit;
