"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var putDoodleRef_1 = require("./aws/dynamodb/putDoodleRef");
AWS.config.region = 'us-east-1';
function mapToString(fields) {
    if (typeof fields === 'object') {
        return fields[0];
    }
    else {
        return void 0;
    }
}
function search(request, response) {
    var params = request.body;
    var csd = new AWS.CloudSearchDomain({
        endpoint: 'search-doodle-ref-xieragrgc2gcnrcog3r6bme75u.us-east-1.cloudsearch.amazonaws.com'
    });
    csd.search({ query: params.query }, function (err, data) {
        if (!err) {
            var found = data.hits.found;
            var start = data.hits.start;
            var refs = data.hits.hit.map(function (record) {
                var href = record.id;
                var owner = mapToString(record.fields['ownerkey']);
                var gistId = mapToString(record.fields['resourcekey']);
                var title = mapToString(record.fields['title']);
                var author = mapToString(record.fields['author']);
                var keywords = record.fields['keywords'];
                return { href: href, owner: owner, gistId: gistId, title: title, author: author, keywords: keywords };
            });
            var body = { found: found, start: start, refs: refs };
            response.status(200).send(body);
        }
        else {
            var reason = err;
            response.status(200).send(reason);
        }
    });
}
exports.search = search;
function submit(request, response) {
    var params = request.body;
    AWS.config.region = 'us-east-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:b419a8b6-2753-4af4-a76b-41a451eb2278',
        Logins: params.credentials
    });
    putDoodleRef_1.default(params, function (err) {
        if (!err) {
            var body = {};
            response.status(200).send(body);
        }
        else {
            response.status(err.statusCode).send(err);
        }
    });
}
exports.submit = submit;
