
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        photoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Photo",
            required: [true, "Photo reference is required"]
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"]
        },

        comment: {
            type: String,
            required: [true, "Comment is required"],
            trim: true,
            minlength: [1, "Comment cannot be empty"],
            maxlength: [1000, "Comment cannot exceed 1000 characters"]
        },

        dateTime: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
