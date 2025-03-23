const Message = require('../models/Message');
const { Server } = require('socket.io');
const freeUser = require('../data/freeUser');
const findMatch = require('../controllers/matchController');
const User = require('../models/User');

const couple = [];

const socket = (server) => {
    console.log('socket');

    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'https://soulsync-fe.pages.dev'],
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        const username = socket.handshake.auth.username;
        if (!username) {
            return next(new Error('Tên người dùng không hợp lệ'));
        }
        socket.username = username;

        const user = await User.findOne({ username }).select('-password');

        socket.user = user;
        // console.log(socket.user);
        // console.log(socket.username);        

        next();
    });

    io.on('connection', (socket) => {
        console.log("connect ", socket.username);

        socket.join(socket.username);
        freeUser.add(socket.username);
        console.log(freeUser);
        let matchedUser = null;


        socket.on('find', async (data) => {
            freeUser.add(socket.username);
            matchedUser = await findMatch(socket.username);
            console.log(matchedUser);

            if (matchedUser) {
                freeUser.delete(socket.username);
                freeUser.delete(matchedUser.username);

                console.log(freeUser);

                couple.push({
                    A: {
                        username: socket.username,
                        status: false
                    },
                    B: {
                        username: matchedUser.username,
                        status: false
                    }
                });

                io.to([socket.username, matchedUser.username]).emit('wait', {
                    A: socket.user,
                    B: matchedUser
                });
            } else {
                console.log('fail');
                io.to(socket.username).emit('fail', {
                    message: "Chúng tôi chưa tìm thấy ai phù hợp với bạn!"
                });
            }
        });

        socket.on('ok', (data) => {
            couple.forEach((cp) => {
                if (cp.A.status && cp.B.status) {
                    io.to([socket.username, matchedUser.username]).emit('match', {
                        message: "Ghép đôi thành công"
                    });
                } else {
                    if (cp.A === socket.user) {
                        cp.A.status = true;
                    } else if (cp.B === socket.user) {
                        cp.B.status = true;
                    }
                }

            });
        });

        socket.on('refuse', (data) => {
            let count = 0;
            couple.forEach((cp) => {
                if (cp.A === socket.user || cp.B === socket.user) {
                    couple.splice(count, 1);

                    freeUser.add(cp.A.username);
                    freeUser.add(cp.B.username);
                }
                count++;
            });
            io.to([socket.username, matchedUser.username]).emit('fail', {
                message: "Ghép đôi thất bại!"
            });

        })

        socket.on('leave', (data) => {
            let count = 0;
            couple.forEach((cp) => {
                if (cp.A === socket.user || cp.B === socket.user) {
                    couple.splice(count, 1);

                    freeUser.add(cp.A.username);
                    freeUser.add(cp.B.username);
                }
                count++;
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
                id, 
                content, 
                updateTime: message.updateTime
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

            let count = 0;
            couple.forEach((cp) => {
                if (cp.A === socket.user) {
                    freeUser.add(cp.B.username);
                    couple.splice(count, 1);
                } else if (cp.B === socket.user) {
                    freeUser.add(cp.A.username);
                    couple.splice(count, 1);
                }
                count++;
            });
            console.log(`${socket.username} diconnected!`);
        });

    });
}

module.exports = socket;
