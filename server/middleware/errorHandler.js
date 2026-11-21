
const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err);

    // Multer file size error
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
            success: false,
            message: "File size cannot exceed 5 MB"
        });
    }

    // Other Multer errors
    if (err.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Invalid image type
    if (
        err.message &&
        err.message.startsWith("Only JPEG")
    ) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Mongoose validation
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(
            (error) => error.message
        );

        return res.status(400).json({
            success: false,
            message: "Database validation failed",
            errors
        });
    }

    // Duplicate fields
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";

        return res.status(409).json({
            success: false,
            message: `${field} already exists`
        });
    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format"
        });
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? "Internal server error"
                : err.message
    });
};

module.exports = errorHandler;
