declare module AWS {
    /////////////////////////////////////////////////////////
    // Bits and Pieces
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
    class DynamoDB extends Service {
        endpoint: Endpoint;
        constructor(options?: {
            apiVersion?: string;
        });
        batchGetItem(params: {}, callback): Request;
        batchWriteItem(params: {}, callback): Request;
        listTables(params: {}, callback: (err, data) => any): Request;
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
