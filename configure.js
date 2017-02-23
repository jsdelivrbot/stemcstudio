"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nconf = require("nconf");
var defaultConfig = {
    PORT: 8080,
    GITHUB_HOST: "github.com",
    GITHUB_PORT: 443,
    GITHUB_PATH: "/login/oauth/access_token",
    GITHUB_METHOD: "POST"
};
var env = process.env.NODE_ENV || 'development';
nconf.use("memory").argv().env().file({ file: "config." + env + ".json" }).defaults(defaultConfig);
