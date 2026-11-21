const fs = require("fs/promises");
const Joi = require("joi");

// Registration validation
const registerSchema = Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().trim().email().max(254).required(),
    password: Joi.string().min(6).max(128).required(),
    location: Joi.string().trim().max(100).allow("").optional(),
    description: Joi.string().trim().max(500).allow("").optional(),
    occupation: Joi.string().trim().max(100).allow("").optional()
});

// Login validation
const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required()
});

// Photo metadata validation
const photoSchema = Joi.object({
    title: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().max(1000).allow("").optional()
});

// Comment validation
const commentSchema = Joi.object({
    comment: Joi.string().trim().min(1).max(1000).required()
});

// Generic validation middleware

const validate = (schema) => {
    return async (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            // Remove uploaded file if validation fails
            if (req.file) {
                await fs.unlink(req.file.path).catch(() => {});
            }

            const errors = error.details.map(
                (detail) => detail.message
            );

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        req.body = value;
        next();
    };
};



module.exports = {
    validate,
    registerSchema,
    loginSchema,
    photoSchema,
    commentSchema
};
