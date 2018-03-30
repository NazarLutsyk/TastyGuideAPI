let winston = require('winston');
let path = require('path');
let mkdirp = require('mkdirp');

let logPath = path.join(__dirname,'../runtime','/logs');
mkdirp(logPath, function (err) {
    if (err) {
        throw new Error(err);
    }
    log(`Create dir ${logPath}`);
});

winston.configure({
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(__dirname, '../runtime','logs', 'exceptions.log'),
        })
    ]
});