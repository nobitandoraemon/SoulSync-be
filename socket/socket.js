const Message = require('../models/Message');
const { Server } = require('socket.io');
const freeUser = require('../data/freeUser');
const findMatch = require('../controllers/matchController')

const couple = new Map([]);

const socket = (server) => {
    console.log('socket');

    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'https://soulsync-fe.pages.dev'],
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
        freeUser.add(socket.username);
        console.log(freeUser);

        socket.on('ok', (data) => {
            const { username } = data; //B's username
            const match = couple.get(username);
            if (!match) {
                couple.set(socket.username, "_"); //If B hasn't hit ok, Set A with a empty "_"
            } else { // If B has hit "ok", then set B with A and emit match
                couple.set(username, socket.username);
                io.to([socket.username, username]).emit('match', {
                    A: socket.username,
                    B: username
                });
            }
        });

        socket.on('leave', (data) => {
            couple.forEach((key, value) => {
                if (key === socket.username || value === socket.username) {
                    couple.delete(key);

                    freeUser.add(key);
                    freeUser.add(value);
                }
            });
        })

        socket.on('chat', async (data) => {
            const { receiver, content } = data;
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
            const { id, content } = data;
            const message = await Message.find({ "_id": id });
            message.content = content;
            message.updateTime = new Date();
            await message.save();

            io.to([receiver, socket.username]).emit('new', {
                id, updateTime: message.updateTime
            });
        });

        socket.on('delete', async (data) => {
            const { id } = data;
            const message = await Message.findByIdAndDelete({ "_id": id });

            io.to([receiver, socket.username]).emit('delete', { //emit delete back to A and B
                id, deleteTime: new Date()
            });
        });

        socket.on('disconnect', () => {
            if (freeUser.has(socket.username)) {
                freeUser.delete(socket.username);
            }

            couple.forEach((key, value) => {
                if (key === socket.username) {
                    couple.delete(key);
                    freeUser.add(value);
                }
                if(value === socket.username) {
                    freeUser.add(key);
                    couple.delete(key);
                }
            });

            console.log(`${socket.username} diconnected!`);
        });

    });
}

module.exports = socket;
