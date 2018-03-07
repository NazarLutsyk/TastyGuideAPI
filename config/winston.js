let winston = require('winston');
let path = require('path');

winston.configure({
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(global.paths.RUNTIME, 'logs', 'exceptions.log'),
        })
    ]
});