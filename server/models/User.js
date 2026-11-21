
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: [2, "First name must be at least 2 characters"]
        },

        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minlength: [2, "Last name must be at least 2 characters"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address"
            ]
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"]
        },

        location: {
            type: String,
            trim: true,
            default: ""
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        occupation: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving a new password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Prevent password from appearing in JSON responses
userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
