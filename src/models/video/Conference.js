import mongoose from 'mongoose';

const conferenceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "can't be blank"],
        index: true
    },

    description: {
        type: String,
        index: true
    },

    mode: {
        type: String,
        enum: [
            "audio", "video"
        ],
        required: [true, "can't be blank"],
    },

    isPrivate: {
        type: Boolean,
        default: true
    },

    isLive: {
        type: Boolean,
        default: true
    },

    isAccepted: {
        type: Boolean,
        default : null
    },

    isRejected: {
        type: Boolean,
        default : null
    },

    speaker: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    broadcastedAt: {
        type: Date
    },

    finishedAt: {
        type: Date,
        default : null
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    strict: true,
    collection: 'Conference'
});

conferenceSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

conferenceSchema.index({ title: "text" });
const Conference = mongoose.model('Conference', conferenceSchema);

export default Conference;
