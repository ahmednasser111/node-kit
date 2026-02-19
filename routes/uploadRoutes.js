const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireLogin } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const sanitized = file.originalname.replace(/\s+/g, '_');
        const uniqueName = `${Date.now()}-${sanitized}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'text/plain',
        'text/csv'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type "${file.mimetype}" not allowed`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5
    }
});

router.get('/', requireLogin, (req, res) => {
    const uploadPath = path.join(__dirname, '../uploads');
    let files = [];
    if (fs.existsSync(uploadPath)) {
        files = fs.readdirSync(uploadPath).map(filename => {
            const filePath = path.join(uploadPath, filename);
            const stats = fs.statSync(filePath);
            return {
                name: filename,
                size: (stats.size / 1024).toFixed(2) + ' KB',
                uploaded: stats.mtime.toLocaleString()
            };
        });
    }

    res.render('upload', {
        title: 'File Manager — NodeKit',
        user: req.user,
        files,
        success: req.query.success || null,
        error: req.query.error || null
    });
});

router.post('/single', requireLogin, upload.single('myfile'), (req, res) => {
    if (!req.file) {
        return res.redirect('/files?error=No+file+selected');
    }
    res.redirect('/files?success=File+uploaded+successfully');
});

router.post('/multiple', requireLogin, upload.array('myfiles', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.redirect('/files?error=No+files+selected');
    }
    res.redirect(`/files?success=${req.files.length}+files+uploaded`);
});

router.get('/download/:filename', requireLogin, (req, res) => {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(__dirname, '../uploads', filename);

    if (!fs.existsSync(filePath)) {
        return res.redirect('/files?error=File+not+found');
    }

    res.download(filePath, filename, (err) => {
        if (err) console.error('Download error:', err.message);
    });
});

router.get('/delete/:filename', requireLogin, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.redirect('/files?error=Only+admins+can+delete+files');
    }

    const filename = path.basename(req.params.filename);
    const filePath = path.join(__dirname, '../uploads', filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    res.redirect('/files?success=File+deleted');
});

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.redirect(`/files?error=${encodeURIComponent(err.message)}`);
    } else if (err) {
        return res.redirect(`/files?error=${encodeURIComponent(err.message)}`);
    }
    next();
});

module.exports = router;
