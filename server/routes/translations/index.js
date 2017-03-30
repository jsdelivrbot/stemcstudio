"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Translate = require('@google-cloud/translate');
var projectId = 'YOUR_PROJECT_ID';
var translateClient = Translate({
    projectId: projectId
});
function getTranslation(request, response) {
    var params = request.params;
    console.log("getTranslation(" + JSON.stringify(params, null, 2) + ")");
    var text = params.input;
    translateClient.translate(text, 'de')
        .then(function (results) {
        var translation = results[0];
        console.log("Text: " + text);
        console.log("Translation: " + translation);
        response.status(200).send({ translation: translation });
    });
}
exports.getTranslation = getTranslation;
//# sourceMappingURL=index.js.map