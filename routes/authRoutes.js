const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');

const USERS = {
    'ahmed': { password: '1234', role: 'admin' },
    'user': { password: 'pass', role: 'user' },
    'guest': { password: 'guest', role: 'guest' },
};

router.get('/', (req, res) => {
    if (req.cookies.session) return res.redirect('/dashboard');
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    if (req.cookies.session) return res.redirect('/dashboard');

    res.render('login', {
        title: 'Login — NodeKit',
        error: req.query.error || null,
        success: req.query.success || null
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = USERS[username];

    if (!user || user.password !== password) {
        return res.render('login', {
            title: 'Login — NodeKit',
            error: 'Invalid username or password',
            success: null
        });
    }

    const sessionData = {
        username,
        role: user.role,
        loginTime: new Date().toISOString()
    };

    const sessionValue = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    res.cookie('session', sessionValue, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    });

    res.redirect('/dashboard');
});

router.get('/dashboard', requireLogin, (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard — NodeKit',
        user: req.user,
        cookies: req.cookies,
        serverTime: new Date().toLocaleString()
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/login?success=You+have+been+logged+out');
});

module.exports = router;
