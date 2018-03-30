const app = require("../app");
const debug = require("debug")("drinker:server");
const https = require("https");
const fs = require("fs");
let path = require('path');

const privateKey = fs.readFileSync(path.join(process.env.HOMEDRIVE, "demo", "myRootCA.key")).toString();
const certificate = fs.readFileSync(path.join(process.env.HOMEDRIVE, "demo", "myRootCA.pem")).toString();

let port = normalizePort(process.env.PORT || "3000");
app.set('port', port);
const server = https.createServer({
    key: privateKey,
    cert: certificate
}, app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

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

function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    debug('Listening on ' + bind);
}
