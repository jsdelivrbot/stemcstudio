define(["require", "exports", './HtmlMode'], function (require, exports, HtmlMode_1) {
    function createCssMode(workerUrl, scriptImports) {
        return new HtmlMode_1.default(workerUrl, scriptImports);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createCssMode;
});
