/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dictUpdate(a, b) {
    for (var kb in b) {
        if (b.hasOwnProperty(kb)) {
            a[kb] = b[kb];
        }
    }
}
exports.dictUpdate = dictUpdate;
