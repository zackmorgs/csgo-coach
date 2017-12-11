module.exports = function() {

    const logger = require('../utils/logger');

    var webSocket = {};
    var socket = null;

    webSocket.init = function(http) {
        socket = require('socket.io')(http);
    };

    webSocket.emitMessage = function(message) {
        socket.emit('message', JSON.stringify(message));
    };

    function onConnection() {
        socket.on('connection', function(socket){
            logger.log('a user connected');
            socket.on('disconnect', function(){
                logger.log('user disconnected');
            });
        });
    }

    return webSocket;
};