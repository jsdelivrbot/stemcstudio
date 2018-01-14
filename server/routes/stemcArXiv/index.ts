import { Request, Response } from 'express';
import * as AWS from 'aws-sdk';
import { SearchParams as ISearchParams } from './SearchParams';
import { SearchResponse as ISearchResponse } from './SearchResponse';
import { SubmitParams as ISubmitParams } from './SubmitParams';
import { SubmitResponse as ISubmitResponse } from './SubmitResponse';
import { putDoodleRef } from './aws/dynamodb/putDoodleRef';

AWS.config.region = 'us-east-1';
// AWS.config.update({ region: 'us-east-1' });

function mapToString(fields: string[]): string {
    if (typeof fields === 'object') {
        return fields[0];
    }
    else {
        return void 0;
    }
}

/**
 * Searches the AWS CloudSearch
 * @param request Generic Express Request.
 * @param response Generic Express Response.
 */
export function search(request: Request, response: Response): void {
    const params: ISearchParams = request.body;
    // The endpoint is the same as that used in the trigger that updates the search index.
    const csd = new AWS.CloudSearchDomain({
        endpoint: 'search-doodle-ref-xieragrgc2gcnrcog3r6bme75u.us-east-1.cloudsearch.amazonaws.com'
    });
    csd.search({ query: params.query, size: 30 }, function (err, data) {
        if (!err) {
            const found = data.hits.found;
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
            response.status(200).send(err);
        }
    });
}

/**
 * Handles a POST request of a Doodle reference.
 * 
 * 1. Sets credentials for AWS.
 * 2. Uses AWS SDK to write a record to the DynamoDB DoodleRef table.
 * 3. On success, returns HTTP 200 and empty body.
 * 4. On Fail return HTTP status code and the error.
 * 
 * On AWS, the write of the record to the DoodleRef table causes a trigger (doodleRefToCloudSearch) to
 * send uploaded documents to the AWS CloudSearch domain (see CONTRIBUTING.md for trigger code).
 *   
 * @param request Generic Express Request.
 * @param response Generic Express Response.
 */
export function submit(request: Request, response: Response): void {
    const params: ISubmitParams = request.body;
    // console.lg(`submit POST ${JSON.stringify(params, null, 2)}`);

    // This is probably redundant if done globally.
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
