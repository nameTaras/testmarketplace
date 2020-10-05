module.exports = function (server) {
    const io = require('socket.io')(server);

    io.on('connection', socket => {
        socket.on('message', (msg, chatId, productId) => {
            socket.broadcast.emit('messageToClients', msg, chatId, productId);
        });
    
        socket.on('disconnect', () => {
            console.log(`Client with id ${socket.id} disconnected`);
        });
    });
}