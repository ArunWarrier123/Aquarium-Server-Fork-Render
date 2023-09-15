import mongoose from "mongoose";

const storyLikeSchema = new mongoose.Schema({
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

storyLikeSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const StoryLike = mongoose.model("StoryLike", storyLikeSchema);

export default StoryLike;