import mongoose from 'mongoose';
import validator from 'validator';

const videoNotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    message: {
        type: String,
        required: true
    },

    isRequest: {
        type: Boolean,
        default: false
    },

    senderUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    isRead: {
        type: Boolean,
        default: false
    },

    isConnected: {
        type: Boolean,
        default: false
    },

    isDeclined: {
        type: Boolean,
        default: false
    },

    isLink: {
        type: Boolean,
        default: false
    },

    link: {
        type: String,
        validate: {
            validator: value => validator.isURL(value, {
                protocols: ['http', 'https'],
                require_tld: false,
                require_protocol: true
            }),
            message: 'Must be a Valid URL'
        }
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
    collection: 'Notification'
});

videoNotificationSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

videoNotificationSchema.index({ message: "text" });
const VideoNotification = mongoose.model('VideoNotification', videoNotificationSchema);

export default VideoNotification;
