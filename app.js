const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
let session = require('express-session');
let MongoStorage = require('connect-mongo')(session);
let passport = require('passport');
let helmet = require('helmet');
require('./config/path');
require('./config/winston');
require('./config/passport/index');
require('./config/schedule');

const passportMiddleware = require('./middleware/passport');
const index = require('./routes/index');
const api = require('./routes/api');
const user = require('./routes/user');
const mail = require('./routes/mail');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/drinker');

app.use(helmet());
app.use(express.static(path.join(__dirname,'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'qweerasdxsd46s548454ad2as1d',
    resave: true,
    saveUninitialized: false,
    store: new MongoStorage({
        mongooseConnection: mongoose.connection
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/api',/*passportMiddleware.isLoggedIn, */api);//todo
app.use('/auth',user);
app.use('/mail',mail);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.sendStatus(err.status || 500);
});

module.exports = app;