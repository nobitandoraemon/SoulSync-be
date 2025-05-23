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
            return next(new Error('Không thể kết nối! Hãy thử lại nhé!'));
        }
        socket.username = username;

        const user = await User.findOne({ username }).select('-password');

        socket.user = user;
        console.log(socket.user);
        console.log(socket.username);        

        next();
    });

    io.on('connection', (socket) => {
        console.log("connect ", socket.username);

        socket.join(socket.username);
        freeUser.add(socket.username);
        console.log("connect ", freeUser);


        socket.on('find', async (data) => {
            let matchedUser = null;
            // couple.forEach(async (couple) => {
            //     if (couple.A.user.username === socket.username) {
            //         io.to([socket.username]).emit('wait', {
            //             A: socket.user,
            //             B: couple.B.user
            //         });
            //         return;
            //     } else if (couple.B.user.username === socket.username) {
            //         io.to([socket.username]).emit('wait', {
            //             A: socket.user,
            //             B: couple.A.user
            //         });
            //         return;
            //     }

            // });

            freeUser.add(socket.username);

            matchedUser = await findMatch(socket.username);
            console.log(matchedUser);

            if (matchedUser) {
                freeUser.delete(socket.username);
                freeUser.delete(matchedUser.username);

                console.log(freeUser);

                couple.push({
                    A: {
                        user: socket.user,
                        liked: false
                    },
                    B: {
                        user: matchedUser,
                        liked: false
                    }
                });
                
                console.log("match", couple.forEach((cp) => console.log(cp.A," - ", cp.B, ", ")
                ));
                
                io.to([socket.username, matchedUser.username]).emit('wait', {
                    A: socket.user,
                    B: matchedUser
                });
            } else {
                console.log('fail');
                io.to(socket.username).emit('fail', {
                    message: "Chúng tôi không tìm thấy ai phù hợp với bạn!"
                });
            }
        });

        socket.on('like', (data) => {
            couple.forEach((cp) => {
                if (cp.A.user.username === socket.username) {
                    cp.A.liked = true;
                    
                    if(cp.B.liked === true) {
                        console.log("love");
                        
                        io.to([cp.A.user.username, cp.B.user.username]).emit('love', {
                            message: "Bạn có thể xem hồ sơ của đối phương!"
                        });
                    } else {
                        io.to([cp.B.user.username]).emit('liked', {
                            message: "Đối phương đã bấm like!"
                        });
                    }
                } else if (cp.B.user.username === socket.username) {
                    cp.B.liked = true;

                    if(cp.A.liked === true) {
                        console.log("love");
                        
                        io.to([cp.A.user.username, cp.B.user.username]).emit('love', {
                            message: "Bạn có thể xem hồ sơ của đối phương!"
                        });
                    } else {
                        io.to([cp.A.user.username]).emit('liked', {
                            message: "Đối phương đã bấm like!"
                        });
                    }
                }
            });
        })

        socket.on('refuse', (data) => {
            let count = 0;
            couple.forEach((cp) => {
                if (cp.A.user.username === socket.username || cp.B.user.username === socket.username) {
                    
                    freeUser.add(cp.A.user.username);
                    freeUser.add(cp.B.user.username);
                    couple.splice(count, 1);
                    
                    io.to([cp.A.user.username, cp.B.user.username]).emit('fail', {
                        message: "Ghép đôi thất bại!"
                    });
                    
                    console.log("refuse ", freeUser);
                    console.log(couple);
                    
                }
                count++;
            });
        })

        socket.on('leave', (data) => {
            let count = 0;
            couple.forEach((cp) => {
                if (cp.A.user.username === socket.username || cp.B.user.username === socket.username) {

                    // freeUser.add(cp.A.username);
                    // freeUser.add(cp.B.username);
                    couple.splice(count, 1);
                    
                    io.to([cp.A.user.username, cp.B.user.username]).emit('end', {
                        message: "Cuộc trò chuyện đã kết thúc từ phía " + socket.username + "!"
                    });
                    console.log("leave ",freeUser);
                    console.log(couple);
                    
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

            io.to([receiver, socket.username]).emit('message', {
                sender: socket.username,
                receiver, content,
                createTime: new Date()
            });
        });

        // socket.on('update', async (data) => {
        //     const { id, content } = data;
        //     const message = await Message.find({ "_id": id });
        //     message.content = content;
        //     message.updateTime = new Date();
        //     await message.save();

        //     io.to([receiver, socket.username]).emit('new', {
        //         id,
        //         content,
        //         updateTime: message.updateTime
        //     });
        // });

        // socket.on('delete', async (data) => {
        //     const { id } = data;
        //     const message = await Message.findByIdAndDelete({ "_id": id });

        //     io.to([receiver, socket.username]).emit('delete', { //emit delete back to A and B
        //         id, deleteTime: new Date()
        //     });
        // });

        socket.on('disconnect', () => {
            if (freeUser.has(socket.username)) {
                freeUser.delete(socket.username);
            }

            let count = 0;
            couple.forEach((cp) => {
                if (cp.A.user.username === socket.username || cp.B.user.username === socket.username) {
                    couple.splice(count, 1);

                    io.to([cp.A.user.username, cp.B.user.username]).emit('end', {
                        message: "Cuộc trò chuyện đã kết thúc từ phía " + socket.username + "!"
                    });
                    console.log("leave ",freeUser);
                    console.log(couple);
                }
                count++;
            });
            console.log(`${socket.username} diconnected!`);
            console.log("dis", couple);
            
            console.log("dis ", freeUser);
            
        });

    });
}

module.exports = socket;
