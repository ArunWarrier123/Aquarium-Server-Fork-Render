import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  followerCount: {
    type: Number,
    default: 0,
  },

  profileImage: {
    type: String,
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

communitySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

communitySchema.index({ groupName: "text" });
const Community = mongoose.model("Community", communitySchema);

export default Community;
