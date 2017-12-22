module.exports = function () {

    const express = require('express');
    const steam = require('steam-login');
    const app = express();
    const http = require('http').Server(app);

    const config = require('../config');
    const logger = require('../utils/logger')();

    var webServer = {};
    webServer.database = require('../utils/database')();
    webServer.webSocket = require('./webSocket')(http);

    webServer.init = function () {

        prepareLogging();
        prepareSessionHandling();
        prepareSteamAuth();
        registerRoutes();

        listen();
    };

    function prepareSessionHandling() {
        app.use(require('express-session')({resave: false, saveUninitialized: false, secret: config.SESSION_SECRET}));
    }

    function prepareLogging() {
        app.use(function (req, res, next) {
            logger.log('IP: ' + req.ip + ' / Request to api with request "' + req.path + '" and body "' + req.body + '"');
            next();
        });
    }

    function prepareSteamAuth() {

        app.use(steam.middleware({
            realm: config.WEB_SERVER_URL + ':' + config.WEB_SERVER_PORT + '/',
            verify: config.WEB_SERVER_URL + ':' + config.WEB_SERVER_PORT + '/steam/verify',
            apiKey: config.STEAM_API_KEY
        }));

    }

    function registerRoutes() {
        app.use('/', require('./routes/static')().routes);
        app.use('/steam/', require('./steamAuth')(webServer.database).routes);
        app.use('/csgo/', require('./routes/csgo')(webServer.webSocket).routes);

        // api
        app.use('/api/teams/', require('./routes/team')(webServer.database).routes);
    }

    function listen() {
        http.listen(config.WEB_SERVER_PORT, function () {
            logger.log('Start web server on *:' + config.WEB_SERVER_PORT + '.');
        });
    }

    return webServer;
};