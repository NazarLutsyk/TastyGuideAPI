let winston = require('winston');
let path = require('path');
let mkdirp = require('mkdirp');

let logPath = path.join(global.paths.RUNTIME + '/logs');
mkdirp(logPath, function (err) {
    if (err) throw new Error(err)
});

winston.configure({
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(global.paths.RUNTIME, 'logs', 'exceptions.log'),
        })
    ]
});