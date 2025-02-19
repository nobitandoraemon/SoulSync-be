const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const port = 3500;

const server = http.createServer(app);
connectDB();

//MIDDLEWARE
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World! :>>>');
});

//ROUTER
app.use('/messages', require('./routes/api/messageRouter'));

//CONNECT TO DATABASE
mongoose.connection.once('open', () => {
    console.log("Database connected...");
    
    server.listen(port, () => {
        console.log(`Server is running on port ${port}...`);
    });
})
