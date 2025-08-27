import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    watchHistory: {
        type: Array,
        default: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //CLOUDINARY URL
        default: "",
        required: true
    },
    coverPicture: {
        type: String, //CLOUDINARY URL
        default: "",
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true
    },
    refreshToken: {
        type: String,
        default: ""
    },
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign({
        id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};

userSchema.methods.updateRefreshToken = function (refreshToken) {
    this.refreshToken = refreshToken;
    return this.save();
};

userSchema.methods.removeRefreshToken = function () {
    this.refreshToken = "";
    return this.save();
};

export const User = mongoose.model("User", userSchema);
