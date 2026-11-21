
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const uploadDirectory = path.join(__dirname, "../uploads");

// Store uploaded files on disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        const uniqueName =
            `${Date.now()}-${crypto.randomUUID()}${extension}`;

        cb(null, uniqueName);
    }
});

// Allow image files only
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, GIF, and WebP images are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;
