nconf = require("nconf")

defaultConfig =
  PORT: 8080

env = process.env.NODE_ENV or "local"
console.log "using NODE_ENV=#{env}"
nconf.use("memory").argv().env().file(file: "config.#{env}.json").defaults(defaultConfig)
