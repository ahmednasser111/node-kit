require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const net = require('net');
const http = require('http');
const os = require('os');

const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const networkRoutes = require('./routes/networkRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRoutes);
app.use('/files', uploadRoutes);
app.use('/network', networkRoutes);

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`🚀 NodeKit running at http://localhost:${PORT}`);
});

const TCP_PORT = process.env.TCP_PORT || 4000;

const tcpServer = net.createServer((socket) => {
    console.log(`🔌 TCP client connected: ${socket.remoteAddress}:${socket.remotePort}`);

    socket.write('Welcome to NodeKit TCP Server!\r\n');
    socket.write('Anything you type will be echoed back.\r\n');

    socket.on('data', (data) => {
        const msg = data.toString().trim();
        console.log(`TCP received: "${msg}"`);
        socket.write(`ECHO: ${msg}\r\n`);
    });

    socket.on('end', () => {
        console.log('TCP client disconnected');
    });

    socket.on('error', (err) => {
        console.error('TCP socket error:', err.message);
    });
});

tcpServer.listen(TCP_PORT, () => {
    console.log(`📡 TCP Echo Server listening on port ${TCP_PORT}`);
});
