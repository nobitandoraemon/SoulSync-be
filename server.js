const express = require('express');
const app = express();
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const socket = require('./socket/socket');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const credentials = require('./middlewares/credentials');
const corOptions = require('./config/corOptions');
const otpRoute = require('./routes/otpRoute');
const port = 3500;

const server = http.createServer(app);
connectDB();
socket(server);

//Middlewares
app.use(credentials);
app.use(cors(corOptions));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/otp',otpRoute);
app.use('/register', require('./routes/registerRouter'));
app.use('/auth', require('./routes/authRouter'));
app.use('/refresh', require('./routes/refreshRouter'));

app.use(require('./middlewares/authMiddleware'));
app.use('/messages', require('./routes/api/messageRouter'));
app.use('/users', require('./routes/api/userRouter'));

mongoose.connection.once('open', () => {
    console.log("Database connected...");
    
    server.listen(port, () => {
        console.log(`Server is running on port ${port}...`);
    });
})
