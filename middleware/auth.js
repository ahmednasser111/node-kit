const requireLogin = (req, res, next) => {
    const session = req.cookies.session;

    if (!session) {
        return res.redirect('/login?error=Please+log+in+first');
    }

    try {
        const userData = JSON.parse(Buffer.from(session, 'base64').toString('utf8'));
        req.user = userData;
        next();
    } catch (err) {
        res.clearCookie('session');
        return res.redirect('/login?error=Invalid+session');
    }
};

module.exports = { requireLogin };
