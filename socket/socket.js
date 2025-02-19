const Message = require('../models/Message');
const { Server } = require('socket.io');

const socket = (server) => {
    console.log('socket');

    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000'],
            credentials: true
        }
    });

    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        if (!username) {
            return next(new Error('Invalid username'));
        }
        socket.username = username;
        next();
    });

    io.on('connection', (socket) => {
        socket.join(socket.username);

        socket.on('chat', async (data) => {
            const {receiver, content } = data;
            const result = await Message.create({
                sender: socket.username,
                receiver, content, 
                createTime: new Date()
            });

            console.log(result);
            
            io.to([receiver, socket.username]).emit('message', {
                sender: socket.username,
                receiver, content, 
                createTime: new Date()
            });
        });

        socket.on('update', async (data) => {
            const {id, content } = data;
            const message = await Message.find({"_id": id});
            message.content = content;
            message.updateTime = new Date();
            await message.save();
            
            io.to([receiver, socket.username]).emit('new', {
                id, updateTime: message.updateTime
            });
        });

        socket.on('disconnect', () => {
            console.log(`${socket.username} diconnected!`);            
        });
    });
}

module.exports = socket;