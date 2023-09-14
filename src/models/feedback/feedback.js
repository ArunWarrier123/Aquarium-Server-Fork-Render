import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    articleId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Article',
        required: true
    },

    content: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ['Feedback', 'Report'],
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

feedbackSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// feedbackSchema.index({ name: "text" });
const FeedBack = mongoose.model("FeedBack", feedbackSchema);

export default FeedBack;