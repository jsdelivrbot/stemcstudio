"use strict";
function dehydrateMap(map) {
    var result = {};
    var keys = Object.keys(map);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var serializable = map[key];
        result[key] = serializable.dehydrate();
    }
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dehydrateMap;
