import * as nconf from "nconf";
import * as http from "http";
import app from "./app";

const port: number = nconf.get("PORT");

const server = http.createServer(app);
server.listen(port, null, function(err) {
  console.log("Express server listening on port " + port);
});
