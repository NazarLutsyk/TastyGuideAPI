let path = require('path');
let APP = process.env.INIT_CWD;

global.paths = {
    APP: APP,
    BIN: path.join(APP, 'bin'),
    CONFIG: path.join(APP, 'config'),
    CONTROLLERS: path.join(APP, 'controllers'),
    HELPERS: path.join(APP, 'helpers'),
    MIDDLEWARE: path.join(APP, 'middleware'),
    MODELS: path.join(APP, 'models'),
    PUBLIC: path.join(APP, 'public'),
    ROUTES: path.join(APP, 'routes'),
    RUNTIME: path.join(APP, 'runtime'),
};
