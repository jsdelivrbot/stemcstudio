declare module 'aws-sdk' {
    /////////////////////////////////////////////////////////
    // Bits and Pieces
    interface Reason {
        message: string;
        code: string;
        time: string;
        requestId: string;
        statusCode: number;
        retryable: boolean;
        retryDelay: number;
    }
    export class Endpoint {
        constructor(endpoint: string);

        host: string;
        hostname: string;
        href: string;
        port: number;
        protocol: string;
    }
    interface Request {

    }

    /////////////////////////////////////////////////////////
    // Services
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/browser-services.html

    /**
     * The service class representing an AWS service.
     */
    class Service {
        /**
         * Returns the list of API versions supported by this service.
         */
        apiVersions: string[];
        constructor(config: { [name: string]: any });
        defineService(serviceIdentifier: string, versions: string[], feautres: Object);
        makeRequest(operation, params, callback): void;
        makeUnathenticatedRequest(operation, params, callback): void;
        setupRequestListeners(): void;
        waitFor(state, params, callback): void;
    }
    class ACM extends Service {

    }
    class APIGateway extends Service {

    }
    interface AttributeValue { [name: string]: any }
    interface CreateTableParams {
        TableName: string;
        KeySchema: {
            AttributeName: string;
            /**
             * 'HASH' for Primary Key.
             * 'RANGE' for Sort Key.
             */
            KeyType: string;
        }[];
        AttributeDefinitions: {
            AttributeName: string;
            /**
             * 'S'
             */
            AttributeType: string;
        }[];
        ProvisionedThroughput: {
            ReadCapacityUnits: number;
            WriteCapacityUnits: number;
        };
    }
    interface DescribeTableParams {
        TableName: string;
    }
    interface ListTablesParams {
    }
    interface Table {
        TableDescription: {
            TableName: string;
            KeySchema: {
                AttributeName: string;
                KeyType: string;
            }[];
            AttributeDefinitions: {
                AttributeName: string;
                AttributeType: string;
            }[];
            /**
             * 'ACTIVE'
             */
            TableStatus: string;
            /**
             * <YYYY-MM-DD> + 'T' + <HH:MM:SS.SSS> + 'Z'
             */
            CreationDateTime: string;
            ProvisionedThroughput: {
                LastIncreaseDateTime: string;
                LastDecreaseDateTime: string;
                NumberOfDecreasesToday: number;
                ReadCapacityUnits: number;
                WriteCapacityUnits: number;
            };
            TableSizeBytes: number;
            ItemCount: number;
            TableArn: string;
        };
    }
    interface PutItemParams {
        Item: { [AttributeName: string]: AttributeValue };
        TableName: string;
        ConditionalExpression?: string;
        /**
         * 'AND' or 'OR'
         */
        ConditionalOperator?: string;
    }
    interface QueryParams {
        TableName: string;
        IndexName?: string;
        ConditionalOperator?: string;
        ConsistentRead?: boolean;
        ExclusiveStartKey?: { [someKey: string]: AttributeValue };
        ExpressionAttributeNames?: { [someKey: string]: string };
        ExpressionAttributeValues?: { [someKey: string]: AttributeValue };
        FilterExpression?: string;
        KeyConditionExpression: string;
        Limit?: number;
        ProjectionExpression?: string;
        ScanIndexForward?: boolean;
        /**
         * 'ALL_ATTRIBUTES' | 'ALL_PROJECTED_ATTRIBUTES' | 'SPECIFIC_ATTRIBUTES' | 'COUNT'
         */
        Select?: string;
    }
    interface QueryResult {
        Items: { [name: string]: AttributeValue }[];
        Count: number;
        ScannedCount: number;
        LastEvaluatedKey: { [name: string]: { [name: string]: AttributeValue } }
    }
    class CloudSearchDomain extends Service {
        endpoint: Endpoint;
        constructor(options: {
            endpoint: string,
            apiVersion?: string
        });
        /**
         * Retrieves a list of documents that match the specified search criteria.
         */
        search(params: {
            query: string;
            cursor?: string;
            expr?: string;
            facet?: string;
            filterQuery?: string;
            highlight?: string;
            partial?: boolean;
            queryOptions?: string;
            queryParser?: string;
            return?: string;
            size?: number;
            sort?: string;
            start?: number;
            stats?: string;
        }, callback: (err: any, data: {
            status: {
                timems: number;
                rid: string;
            },
            hits: {
                found: number;
                start: number;
                hit: {
                    id: string;
                    fields: { [name: string]: string[] };
                }[];
            }
        }) => any): Request;
        /**
         * Retrieves autocomplete suggestions for a partial query string.
         */
        suggest(params: {}, callback: (err: any, data) => any): Request;
        /**
         * Posts a batch of documents to a search domain for indexing.
         */
        uploadDocuments(params: {}, callback: (err: any, data) => any): Request;
    }
    class DynamoDB extends Service {
        endpoint: Endpoint;
        constructor(options?: {
            apiVersion?: string;
        });
        // Control Plan
        createTable(params: CreateTableParams, callback: (err: any, data) => any): Request;
        deleteTable(params: { TableName: string }, callback: (err: any, data: any) => any): Request;
        describeTable(params: DescribeTableParams, callback: (err: any, data: { Table: Table }) => any): Request;
        listTables(params: ListTablesParams, callback: (err, data: { TableNames: string[] }) => any): Request;
        // Data Plane
        putItem(params: PutItemParams, callback: (err, data: any) => any): Request;
        batchWriteItem(params: {}, callback): Request;
        // Reading data
        batchGetItem(params: {}, callback): Request;
        query(params: QueryParams, callback: (err: any, data: QueryResult) => any): Request;
        // Updating data
        // Deleting Data
    }
    /////////////////////////////////////////////////////////
    // Identity and Access Management
    interface Credentials {

    }
    class CognitoIdentityCredentials implements Credentials {
        constructor(options: {
            IdentityPoolId: string;
            /**
             * A map of identity provider names to identity tokens.
             * e.g. identity providers:
             * 'graph.facebook.com'
             * 'www.amazon.com'
             * 'accounts.google.com'
             */
            Logins?: { [identityProviderName: string]: string };
        });
    }
    class WebIdentityCredentials implements Credentials {
        constructor(options: {
            RoleArn: string;
            ProviderId: string;
            WebIdentityToken: string;
        });
    }
    export const config: {
        apiVersions: { [serviceId: string]: string }
        credentials: Credentials;
        region: string;
    };
}
