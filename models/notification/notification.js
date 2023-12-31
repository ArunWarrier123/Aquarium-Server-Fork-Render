import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  to: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  body: {
    type: String,
  },


  type: {
    type: String,
    enum: [
      "normal", "postLike", "postComment", "postMention", "postShare",
      "story", "security", "commentLike", "commentReply", "commentMention",
      "commentReplyLike", "follow", "followRequest", "followRequestAccepted",
      "followRequestRemoved", "followRequestApproved", "followRequestDeclined",
      "storyMention", "storyLike", "storyComment", "storyShare",
    ],
    default: "normal",
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  // refId: String,


  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

notificationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
