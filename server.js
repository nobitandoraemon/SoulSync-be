const express = require('express');
const app = express();
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const port = 3500;

const server = http.createServer(app);
connectDB();

app.get('/', (req, res) => {
    res.send('Hello World! toi la nga');
});

app.get('/login', (req, res) => {
    res.send('this is login');
})

mongoose.connection.once('open', () => {
    console.log("Database connected...");
    
    server.listen(port, () => {
        console.log(`Server is running on port ${port}...`);
    });
})
