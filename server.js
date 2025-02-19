const express = require('express');
const app = express();
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const socket = require('./socket/socket');
const cookieParser = require('cookie-parser');
const port = 3500;

const server = http.createServer(app);
connectDB();
socket(server);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

mongoose.connection.once('open', () => {
    console.log("Database connected...");
    
    server.listen(port, () => {
        console.log(`Server is running on port ${port}...`);
    });
})
