import { Request, Response } from 'express';
import * as AWS from 'aws-sdk';
import { SearchParams as ISearchParams } from './SearchParams';
import { SearchResponse as ISearchResponse } from './SearchResponse';
import { SubmitParams as ISubmitParams } from './SubmitParams';
import { SubmitResponse as ISubmitResponse } from './SubmitResponse';
import { putDoodleRef } from './aws/dynamodb/putDoodleRef';

AWS.config.region = 'us-east-1';

function mapToString(fields: string[]): string {
    if (typeof fields === 'object') {
        return fields[0];
    }
    else {
        return void 0;
    }
}

/**
 * 
 */
export function search(request: Request, response: Response): void {
    const params: ISearchParams = request.body;
    // console.lg(`search POST ${JSON.stringify(params, null, 2)}`);
    const csd = new AWS.CloudSearchDomain({
        endpoint: 'search-doodle-ref-xieragrgc2gcnrcog3r6bme75u.us-east-1.cloudsearch.amazonaws.com'
    });
    csd.search({ query: params.query }, function (err, data) {
        if (!err) {
            // const timems = data.status.timems;
            const found = data.hits.found;
            // console.lg(`search took ${timems} ms, found ${found} record(s).`)
            const start = data.hits.start;
            const refs = data.hits.hit.map(function (record) {
                const href = record.id;
                const owner = mapToString(record.fields['ownerkey']);
                const gistId = mapToString(record.fields['resourcekey']);
                const title = mapToString(record.fields['title']);
                const author = mapToString(record.fields['author']);
                const keywords = record.fields['keywords'];
                return { href, owner, gistId, title, author, keywords };
            });
            const body: ISearchResponse = { found, start, refs };
            response.status(200).send(body);
        }
        else {
            const reason: AWS.Reason = err;
            response.status(200).send(reason);
        }
    });
}

export function submit(request: Request, response: Response): void {
    const params: ISubmitParams = request.body;
    // console.lg(`submit POST ${JSON.stringify(params, null, 2)}`);

    AWS.config.region = 'us-east-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        // This identifier comes from looking at the generated sample code for
        // the identity provider called STEMCstudio for the JavaScript platform.
        // It can also be seen by "Edit identity pool".
        IdentityPoolId: 'us-east-1:b419a8b6-2753-4af4-a76b-41a451eb2278',
        Logins: params.credentials
    });

    putDoodleRef(params, (err: AWS.Reason) => {
        if (!err) {
            const body: ISubmitResponse = {};
            response.status(200).send(body);
        }
        else {
            response.status(err.statusCode).send(err);
        }
    });
}
