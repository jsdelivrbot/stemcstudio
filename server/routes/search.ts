import * as express from 'express';
import * as AWS from 'aws-sdk';

AWS.config.region = 'us-east-1';

function mapToString(fields: string[]): string {
    if (typeof fields === 'object') {
        return fields[0];
    }
    else {
        return void 0;
    }
}

interface SearchParams {
    query: string;
}

/**
 * search is implemented as a POST because of the user's id_token in the payload.
 * What do we do about other identity providers?
 */
export function search(request: express.Request, response: express.Response) {
    // console.log(`search POST ${JSON.stringify(request.body, null, 2)}`);
    const params: SearchParams = request.body;
    const csd = new AWS.CloudSearchDomain({
        endpoint: 'search-doodle-ref-xieragrgc2gcnrcog3r6bme75u.us-east-1.cloudsearch.amazonaws.com'
    });
    csd.search({ query: params.query }, function(err, data) {
        if (!err) {
            const timems = data.status.timems;
            const found = data.hits.found;
            // console.log(`search took ${timems} ms, found ${found} record(s).`)
            const start = data.hits.start;
            const refs = data.hits.hit.map(function(record) {
                const href = record.id;
                const owner = mapToString(record.fields['ownerkey']);
                const gistId = mapToString(record.fields['resourcekey']);
                const title = mapToString(record.fields['title']);
                const author = mapToString(record.fields['author']);
                const keywords = record.fields['keywords'];
                return { href, owner, gistId, title, author, keywords };
            });
            const body = { found, start, refs };
            response.status(200).send(body);
        }
        else {
            const reason: AWS.Reason = err;
            response.status(200).send(err);
        }
    });
}