"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mustBeTruthy(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
exports.mustBeTruthy = mustBeTruthy;
function mustBeFalsey(condition, message) {
    if (condition) {
        throw new Error(message);
    }
}
exports.mustBeFalsey = mustBeFalsey;
//# sourceMappingURL=asserts.js.map