import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({


    vendorId: {
        type: mongoose.Schema.ObjectId,
        ref: "Vendor",
        required: true
    },

    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    description: {
        type: String,
        required: true,
    },

    rating: Number,

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

ratingSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

ratingSchema.index({ rating: "text" });
const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;