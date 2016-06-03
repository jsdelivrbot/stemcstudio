"use strict";
var ServerEditor_1 = require('./ServerEditor');
var ServerWorkspace = (function () {
    function ServerWorkspace() {
    }
    ServerWorkspace.prototype.createEditor = function () {
        return new ServerEditor_1.default();
    };
    ServerWorkspace.prototype.deleteEditor = function (editor) {
    };
    return ServerWorkspace;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServerWorkspace;
