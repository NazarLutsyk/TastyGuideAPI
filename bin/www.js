var app = require('../app');
var debug = require('debug')('drinker:server');
var https = require('https');
var fs = require('fs');
let path = require('path');

var privateKey = fs.readFileSync(path.join(process.env.HOMEDRIVE, 'demo','myRootCA.key')).toString();
var certificate = fs.readFileSync(path.join(process.env.HOMEDRIVE, 'demo','myRootCA.pem')).toString();

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server = https.createServer({
    key: privateKey,
    cert: certificate
}, app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    var port = parseInt(val, 10);
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

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

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
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
