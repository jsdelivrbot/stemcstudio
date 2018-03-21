declare module "forcedomain" {
    import express = require('express');

    /**
     * forcedomain is a middleware for Connect and Express that redirects any request to a default domain,
     * e.g. to redirect to either the www or the non-www version of a domain.
     */
    function forceDomain(options: {
        hostname: string;
        port?: number;
        protocol?: string;
        type?: 'temporary';
        excludeRule?: RegExp;
    }): express.RequestHandler

    export = forceDomain;
}