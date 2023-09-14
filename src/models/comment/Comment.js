import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({


  parentCommentId: {
    type: mongoose.Schema.ObjectId,
    ref: "Comment",
    // required: true,
  },

  articleId: {
    type: mongoose.Schema.ObjectId,
    ref: "Article",
    required: true
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },

  content: {
    type: String,
    required: true,
  },

  likesCount: {
    type: Number,
    default: 0,
  },

  repliesCount: {
    type: Number,
    default: 0,
  },


  
  //--------------------------------------------//
  // below here are old mental wellnes schema 
  //--------------------------------------------//


  // type: {
  //   type: String,
  //   enum: [
  //     "text", "media", "poll"
  //   ],
  //   default: "text",
  // },




  // story: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "Story",
  // },



  // commentStatus: {
  //   type: String,
  //   enum: [
  //     "active", "deleted", "reported", "archived",
  //     "unarhived", "withheld", "blocked", "flagged",
  //     "banned", "muted", "verified", "unverified",
  //   ],
  //   default: "active",
  // },

  // visibility: {
  //   type: String,
  //   enum: [
  //     "public", "private", "followers",
  //     "mutual", "close_friends",
  //   ],
  //   default: "public",
  // },

  // is_anonymous: {
  //   type: Boolean,
  //   default: false,
  // },

  // allowLikes: {
  //   type: Boolean,
  //   default: true,
  // },

  // allowReplies: {
  //   type: Boolean,
  //   default: true,
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

commentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
