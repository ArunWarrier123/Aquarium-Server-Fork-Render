import mongoose from "mongoose";

const AuthTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },

    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    expiresAt: {
        type: Number,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

AuthTokenSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
AuthTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 })
const AuthToken = mongoose.model("AuthToken", AuthTokenSchema);

export default AuthToken;