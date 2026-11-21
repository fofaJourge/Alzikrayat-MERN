
const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const {
    validate,
    commentSchema
} = require("../middleware/validation");

const {
    addComment
} = require("../controllers/commentController");

// POST /api/photos/:id/comments
router.post(
    "/:id/comments",
    authenticate,
    validate(commentSchema),
    addComment
);

module.exports = router;
