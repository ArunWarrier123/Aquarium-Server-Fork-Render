import mongoose from "mongoose";

const storyReportSchema = new mongoose.Schema({
    story: {
        type: mongoose.Schema.ObjectId,
        ref: "Story",
        required: true,
    },

    reporter: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

    reportReason: {
        type: String,
        required: true,
        maxlength: 100,
    },

    reportStatus: {
        type: String,
        enum: [
            "pending", "resolved", "rejected",
            "ignored", "closed"
        ],
        default: "pending",
    },

    resolvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },

    resolvedAt: {
        type: Date,
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

storyReportSchema.pre("save", function (next) {
    this.updatedAt = Date.now();

    next();
});

const StoryReport = mongoose.model("StoryReport", storyReportSchema);

export default StoryReport;