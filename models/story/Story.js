import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.ObjectId,
    ref: "Group",
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  caption: {
    type: String,
    maxlength: 500,
  },

  mediaFiles: [
    {
      public_id: String,
      url: String,
      thumbnail: {
        public_id: String,
        url: String,
      },
      mediaType: {
        type: String,
        enum: [
          "image", "video", "gif"
        ],
        default: "image",
      },
    }
  ],

  viewsCount: {
    type: Number,
    default: 0,
  },

  likesCount: {
    type: Number,
    default: 0,
  },

  commentsCount: {
    type: Number,
    default: 0,
  },

  repostsCount: {
    type: Number,
    default: 0,
  },

  sharesCount: {
    type: Number,
    default: 0,
  },

  storyStatus: {
    type: String,
    enum: [
      "active", "deleted", "reported", "archived",
      "unarhived", "withheld", "blocked", "flagged",
      "banned", "muted", "verified", "unverified", 
      "clear", "blurr",
    ],
    default: "active",
  },

  visibility: {
    type: String,
    enum: [
      "public", "private", "followers",
      "mutual", "close_friends",
    ],
    default: "public",
  },

  is_anonymous: {
    type: Boolean,
    default: false,
  },

  blur: {
    type: Boolean,
    default: false,
  },

  semi_blur: {
    type: Boolean,
    default: false,
  },

  allowComments: {
    type: Boolean,
    default: true,
  },

  allowLikes: {
    type: Boolean,
    default: true,
  },

  allowReposts: {
    type: Boolean,
    default: true,
  },

  allowShare: {
    type: Boolean,
    default: true,
  },

  allowDownload: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  expiredAt: {
    type: Date,
    default: Date.now() + 24 * 60 * 60 * 1000,
  }
});

storySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

storySchema.index({ caption: "text" });
const Story = mongoose.model("Story", storySchema);

export default Story;
