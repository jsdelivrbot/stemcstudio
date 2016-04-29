define(["require", "exports", './CssMode'], function (require, exports, CssMode_1) {
    function createCssMode(workerUrl, scriptImports) {
        return new CssMode_1.default(workerUrl, scriptImports);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createCssMode;
});
