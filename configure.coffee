nconf = require("nconf")

defaultConfig =
  PORT: 8080,
  GITHUB_HOST: "github.com",
  GITHUB_PORT: 443,
  GITHUB_PATH: "/login/oauth/access_token",
  GITHUB_METHOD: "POST"

env = process.env.NODE_ENV or "local"
console.log "using NODE_ENV=#{env}"
nconf.use("memory").argv().env().file(file: "config.#{env}.json").defaults(defaultConfig)
