modules.exports = function(http) {

    const logger = require('../utils/logger');

    var webSocket = {};
    var socket = null;

    webSocket.init = function() {
        socket = require('socket.io')(http);
    }

    webSocket.emitMessage = function(message) {
        socket.emit('message', JSON.stringify(data));
    }

    function onConnection() {
        socket.on('connection', function(socket){
            logger.log('a user connected');
            socket.on('disconnect', function(){
                logger.log('user disconnected');
            });
        });
    }

    return webSocket;
}