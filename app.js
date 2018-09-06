require("./utils/logger")(false);
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let session = require("express-session");
let MongoStorage = require("connect-mongo")(session);
let passport = require("passport");
let helmet = require("helmet");
let cors = require("cors");
require("./config/winston");
require("./config/passport/index");
require("./config/schedule");

const passportMiddleware = require("./middleware/passport");
const index = require("./routes/index");
const api = require("./routes/api");
const user = require("./routes/user");
const mail = require("./routes/mail");

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/drinker");

app.use(cors({
    credentials: true, origin: [
        "http://localhost:8100",
        "http://192.168.1.14:8100",
        "http://192.168.1.38:8100",
        "http://192.168.0.100:8100",
    ]
}));
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: "qweerasdxsd46s548454ad2as1d",
    resave: true,
    saveUninitialized: false,
    store: new MongoStorage({
        mongooseConnection: mongoose.connection
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", index);
app.use("/api", api);
app.use("/auth", user);
app.use("/mail", mail);

app.use(function (req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    return next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    let errToResponse = {
        message: err.message,
        status: err.status,
        stack: err.stack
    };
    res.json(errToResponse);
});

module.exports = app;