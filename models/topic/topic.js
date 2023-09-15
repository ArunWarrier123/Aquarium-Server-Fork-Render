import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please provide a name for the tag"],
        unique: true,
        trim: true,
        maxlength: [50, "A tag name cannot be more than 50 characters"],
    },

    iconURL: {
        type: String,
        required: true
    },

    // postsCount: {
    //     type: Number,
    //     default: 0,
    // },

    // storiesCount: {
    //     type: Number,
    //     default: 0,
    // },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

topicSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// topicSchema.index({ name: "text" });
const Topic = mongoose.model("Topic", topicSchema);

export default Topic;