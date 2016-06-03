import * as nconf from "nconf";
import * as http from "http";
import app from "./app";
// import sockets from "./sockets";

const port: number = normalizePort(nconf.get("PORT") || 8080);
app.set('port', port);

//
// This is how the server is created at https://github.com/socketio/socket.io
//
// TODO: Review importing https for 
const server = http.createServer(app);

//
// Initialize the sockets part of our application.
//
// sockets(app, server);

server.listen(port, onListening);

server.on('error', onError);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(value: string): any {
    const port = parseInt(value, 10);

    if (isNaN(port)) {
        // named pipe
        return value;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('STEMCstudio HTTP server is listening on ' + bind);
}

//
// Log uncaught exceptions.
//
process.on('uncaughtException', function(err) {
    console.log('Exception: ' + err.stack);
});
