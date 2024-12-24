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
        enum:['USER', 'ADMIN' , 'MANAGER' , 'OWNER']        
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    approved:{
        type:Boolean,
        default:false,
    }
}, {
    timestamps: true,
});

userSchema.pre('save', function (next) {
    if (!this.isModified("password")) return next();
    
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
