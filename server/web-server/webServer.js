module.exports = function() {
    
    const   express             = require('express'),
            steam               = require('steam-login'),

            app                 = express(),
            http                = require('http').Server(app),
            steamAuth           = require('./steam-auth')();

            staticFileRoutes    = require('./staticFileRoutes'),
            apiRoutes           = require('./apiRoutes'),

            config              = require('../config'),
            logger              = require('../utils/logger')();

    var webServer = {};
    webServer.webSocket = require('./webSocket')();

    webServer.init = function() {

        webServer.webSocket.init(http);
        prepareLogging();

        app.use(require('express-session')({ resave: false, saveUninitialized: false, secret: 'a secret' }));

        prepareSteamAuth();
        registerRoutes();
        
        listen();
    };

    function prepareLogging() {
        app.use(function(req, res, next) {
            logger.log('Request to api with request "' + req.path + '" and body "' + req.body + '"');
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
        app.use('/', staticFileRoutes);
        app.use('/api/', apiRoutes);
        app.use('/steam/', steamAuth.router);
    }

    function listen() {
        http.listen(config.WEB_SERVER_PORT, function(){
            logger.log('Start web server on *:' + config.WEB_SERVER_PORT + '.');
        });
    }
    
    return webServer;
};