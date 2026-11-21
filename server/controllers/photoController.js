
const Photo = require("../models/Photo");
const Comment = require("../models/Comment");

const fs = require("fs/promises");
const path = require("path");

// ==========================================
// GET ALL PHOTOS
// GET /api/photos
// ==========================================
const getAllPhotos = async (req, res, next) => {
    try {
        const photos = await Photo.find()
            .populate("userId", "firstName lastName")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: photos.length,
            photos
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// GET SINGLE PHOTO + COMMENTS
// GET /api/photos/:id
// ==========================================
const getPhotoById = async (req, res, next) => {
    try {
        const photo = await Photo.findById(req.params.id)
            .populate("userId", "firstName lastName");

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Photo not found"
            });
        }

        const comments = await Comment.find({
            photoId: photo._id
        })
            .populate("userId", "firstName lastName")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            photo,
            comments
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// UPLOAD PHOTO
// POST /api/photos
// ==========================================
const uploadPhoto = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Photo file is required"
            });
        }

        const { title, description } = req.body;

        const photo = await Photo.create({
            userId: req.user.id,
            fileName: req.file.filename,
            title,
            description
        });

        return res.status(201).json({
            success: true,
            message: "Photo uploaded successfully",
            photo
        });
    } catch (error) {
        // Remove uploaded file if DB creation fails
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }

        next(error);
    }
};

// ==========================================
// DELETE PHOTO
// DELETE /api/photos/:id
// ==========================================
const deletePhoto = async (req, res, next) => {
    try {
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Photo not found"
            });
        }

        // Ownership verification
        if (photo.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this photo"
            });
        }

        // Delete related comments
        await Comment.deleteMany({
            photoId: photo._id
        });

        // Delete file from uploads directory
        const filePath = path.join(
            __dirname,
            "../uploads",
            photo.fileName
        );

        await fs.unlink(filePath).catch((error) => {
            if (error.code !== "ENOENT") {
                throw error;
            }
        });

        // Delete photo metadata
        await Photo.findByIdAndDelete(photo._id);

        return res.status(200).json({
            success: true,
            message: "Photo deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPhotos,
    getPhotoById,
    uploadPhoto,
    deletePhoto
};
