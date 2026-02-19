const express = require('express');
const router = express.Router();
const net = require('net');
const dns = require('dns');
const os = require('os');
const { requireLogin } = require('../middleware/auth');

router.get('/', requireLogin, (req, res) => {
    const interfaces = os.networkInterfaces();
    const ipList = [];

    for (const [name, addrs] of Object.entries(interfaces)) {
        addrs.forEach(addr => {
            ipList.push({
                interface: name,
                family: addr.family,
                address: addr.address,
                internal: addr.internal
            });
        });
    }

    const requestInfo = {
        clientIP: req.ip,
        method: req.method,
        url: req.originalUrl,
        protocol: req.protocol,
        hostname: req.hostname,
        headers: req.headers
    };

    res.render('network', {
        title: 'Network Info — NodeKit',
        user: req.user,
        ipList,
        requestInfo,
        serverHost: os.hostname(),
        nodeVersion: process.version,
        platform: os.platform()
    });
});

router.get('/dns/:hostname', requireLogin, (req, res) => {
    const { hostname } = req.params;
    dns.lookup(hostname, { all: true }, (err, addresses) => {
        if (err) {
            return res.json({ error: err.message });
        }
        res.json({ hostname, addresses });
    });
});

router.get('/tcpcheck', requireLogin, (req, res) => {
    const host = req.query.host || 'localhost';
    const port = parseInt(req.query.port) || 4000;
    const startTime = Date.now();

    const client = net.createConnection({ host, port, timeout: 3000 }, () => {
        const elapsed = Date.now() - startTime;
        client.destroy();
        res.json({
            host,
            port,
            status: 'OPEN',
            latency: `${elapsed}ms`
        });
    });

    client.on('timeout', () => {
        client.destroy();
        res.json({ host, port, status: 'TIMEOUT' });
    });

    client.on('error', (err) => {
        res.json({ host, port, status: 'CLOSED / ERROR', reason: err.message });
    });
});

module.exports = router;
