
const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");
const upload = require("../config/multer");

const {
    validate,
    photoSchema
} = require("../middleware/validation");

const {
    getAllPhotos,
    getPhotoById,
    uploadPhoto,
    deletePhoto
} = require("../controllers/photoController");

// GET /api/photos
router.get("/", getAllPhotos);

// GET /api/photos/:id
router.get("/:id", getPhotoById);

// POST /api/photos
router.post(
    "/",
    authenticate,
    upload.single("photo"),
    validate(photoSchema),
    uploadPhoto
);

// DELETE /api/photos/:id
router.delete(
    "/:id",
    authenticate,
    deletePhoto
);

module.exports = router;
