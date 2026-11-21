
const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Photo owner is required"]
        },

        fileName: {
            type: String,
            required: [true, "Photo filename is required"],
            trim: true
        },

        title: {
            type: String,
            required: [true, "Photo title is required"],
            trim: true,
            minlength: [2, "Title must be at least 2 characters"],
            maxlength: [100, "Title cannot exceed 100 characters"]
        },

        description: {
            type: String,
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters"],
            default: ""
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

// Populate owner information when needed
photoSchema.virtual("owner", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true
});

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
