const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const crypto = require("crypto");
const { JWT_SECRET_KEY } = require("../../config/env");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    usertype: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
}, {
    timestamps: true,
});

// Use a regular function instead of an arrow function
userSchema.pre('save', function (next) {
    if (!this.isModified("password")) return next();

    // Generate salt and hash password
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto
        .pbkdf2Sync(this.password, this.salt, 10000, 64, "sha512")
        .toString("hex");

    next();
});

userSchema.methods.passwordMatched = function (plainPassword) {
    const hashedPassword = crypto
        .pbkdf2Sync(plainPassword, this.salt, 10000, 64, "sha512")
        .toString("hex");
        
    return this.password === hashedPassword;
};

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id.toString() }, JWT_SECRET_KEY, { expiresIn: '24h' });
    return token;
};

userSchema.index({ email: 1 }, { unique: true });
const User = mongoose.model('User', userSchema);

module.exports = User;
