
const Comment = require("../models/Comment");
const Photo = require("../models/Photo");

// ==========================================
// ADD COMMENT
// POST /api/photos/:id/comments
// ==========================================
const addComment = async (req, res, next) => {
    try {
        const { comment } = req.body;
        const photoId = req.params.id;

        // Verify that the photo exists
        const photo = await Photo.findById(photoId);

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Photo not found"
            });
        }

        // Create comment using authenticated user
        const newComment = await Comment.create({
            photoId: photo._id,
            userId: req.user.id,
            comment
        });

        // Return comment with user information
        const populatedComment = await Comment.findById(newComment._id)
            .populate("userId", "firstName lastName");

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addComment
};
