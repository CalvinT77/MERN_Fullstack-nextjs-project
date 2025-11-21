import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
    },
    verificationExpires: {
        type: Date,
        default: new Date(0)
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
    lastLoggedIn: {
        type: Date,
        default: Date.now(),
    }
})

const User = mongoose.model('User', userSchema)

export default User