const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set storage engine for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Store images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Keep the original filename, sanitize it to avoid issues with special characters
        const originalName = file.originalname;
        const fileExtension = path.extname(originalName);
        const sanitizedFileName = path.basename(originalName, fileExtension).replace(/\s+/g, '-') + fileExtension; // Remove spaces
        cb(null, sanitizedFileName); // Use the original filename
    }
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true); // Accept the file
    } else {
        cb('Error: Only images are allowed');
    }
};

const upload = multer({ storage, fileFilter });

// Handle image upload
router.post('/upload', upload.single('coverImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    // Return the file path relative to the 'uploads' folder
    res.json({ imageURL: `/uploads/${req.file.filename}` });
});

module.exports = router;
