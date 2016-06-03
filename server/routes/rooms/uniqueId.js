"use strict";
function uniqueId() {
    var soup = 'abcdefghijklmnopqrstuvwxyz';
    var id = soup.charAt(Math.random() * soup.length);
    soup += '0123456789-_:.';
    for (var x = 1; x < 8; x++) {
        id += soup.charAt(Math.random() * soup.length);
    }
    if (id.indexOf('--') !== -1) {
        id = uniqueId();
    }
    return id;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = uniqueId;
