const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null
var gSocketBySessionIdMap = {}
var usersMapById = {}


function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });
    const sharedSession = require('express-socket.io-session');

    gIo.use(sharedSession(session, {
        autoSave: true
    }));

    gIo.on('connection', socket => {
        console.log('someoneConnect');
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null
            }
        })
        socket.on('joinBoard', (boardId) => {
            if (socket.boardId === boardId) return
            if (socket.boardId) {
                socket.leave(socket.boardId)
            }
            socket.join(boardId)
            socket.boardId = boardId
            console.log('room', socket.boardId);
        })
        socket.on('quill-changed', delta => {
            socket.broadcast.emit('update-quill', delta)
        })

        socket.on('userSocket', user => {
            if (socket.userId) {
                usersMapById[user._id] = null
                socket.leave(socket.userId)
            }
            socket.name = user.fullname
            usersMapById[user._id] = socket
            socket.join(user._Id)
            socket.userId = user._id

        })

        socket.on('onSendMsg', msg => {
            console.log('hereeeeeee', msg);
            gIo.emit('sendMsg', msg)
        })

        socket.on('onUpdateUser', user => {
            const userSocket = usersMapById[user._id]
            if (userSocket) gIo.to(userSocket.id).emit('updateUser', user)
        })
    })
}

// Send to all sockets BUT not the current socket 
function broadcast({ type, data, room = null }) {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
    const excludedSocket = gSocketBySessionIdMap[sessionId]
    if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map')
    if (room) excludedSocket.broadcast.to(room).emit(type, data)
    else excludedSocket.broadcast.emit(type, data)
}

module.exports = {
    connectSockets,
    broadcast,

}



