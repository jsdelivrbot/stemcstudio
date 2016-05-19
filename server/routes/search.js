"use strict";
var AWS = require('aws-sdk');
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
            var timems = data.status.timems;
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
            response.status(200).send(err);
        }
    });
}
exports.search = search;
