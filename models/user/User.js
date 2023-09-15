import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../index.js";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    // required: [true, "Please enter an email."],
  },

  password: {
    type: String,
    required: [true, "Please enter a password."],
    minlength: [6, "password must be at least 6 characters."],
    select: false,
  },

  country: {
    type: String,
    // minlength: [3, "First name must be at least 3 characters."],
    required: [true, "Please provide country name."],
  },

  state: {
    type: String,
    // minlength: [3, "First name must be at least 3 characters."],
    required: [true, "Please provide state name."],
  },

  city: {
    type: String,
    // minlength: [3, "First name must be at least 3 characters."],
    required: [true, "Please provide city name."],
  },
  fullname: {
    type: String,
    // minlength: [3, "name must be at least 3 characters."],
    required: [true, "Please enter a first name."],
  },

  username: {
    type: String,
    minlength: [3, "User Name must be at least 3 characters."],
    required: [true, "Please enter a user name."],
  },

  phone: String,

  dateofbirth: String,

  gender: String,

  bio: String,

  profileimage: {
    type: String,
    required: [true, "Please provide profile picture."],
  },

  type: {
    type: String,
    enum: ["business", "user"],
    default: "user",
  },

  interestedarea: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Topic'
    }
  ],

  storiesCount: {
    type: Number,
    default: 0,
  },

  followersCount: {
    type: Number,
    default: 0,
  },

  followingCount: {
    type: Number,
    default: 0,
  },

  communitylist: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Community'
    }
  ],

  balance_points: {
    type: Number,
    default: 0
  },


  //--------------------------------------------//
  // below here are old mental wellnes schema 
  //--------------------------------------------//

  // nameChangedAt: Date,



  // emailVerified: {
  //   type: Boolean,
  //   default: false,
  // },

  // emailChangedAt: Date,

  // uname: {
  //   type: String,
  //   required: [true, "Please enter an username."],
  //   minlength: [3, "Username must be at least 3 characters."],
  //   maxlength: [20, "Username must not exceeds 20 characters."],
  // },

  // usernameChangedAt: Date,


  // countryCode: String,

  // phoneVerified: {
  //   type: Boolean,
  //   default: false,
  // },

  // phoneChangedAt: Date,

  // language: { // ISO 639-1 (alpha-2 code)
  //   type: String,
  //   default: "en",
  //   lowercase: true,
  //   minlength: 2,
  //   maxlength: 2
  // },

  // groups: [{
  //   type: mongoose.Schema.ObjectId,
  //   ref: "Group",
  //   required: true,
  // }],


  // passwordChangedAt: Date,

  // avatar: {
  //   public_id: String,
  //   url: String,
  // },


  // profession: {
  //   type: String,
  //   maxlength: 100,
  // },

  // location: {
  //   type: String,
  // },

  // website: {
  //   type: String,
  // },

  // postsCount: {
  //   type: Number,
  //   default: 0,
  // },

  // storiesCount: {
  //   type: Number,
  //   default: 0,
  // },

  // followersCount: {
  //   type: Number,
  //   default: 0,
  // },

  // followingCount: {
  //   type: Number,
  //   default: 0,
  // },


  // accountStatus: {
  //   type: String,
  //   enum: [
  //     "active", "inactive", "deactivated",
  //     "suspended", "blocked", "deleted",
  //     "banned", "reported", "pending",
  //     "withheld", "restricted",
  //   ],
  //   default: "active",
  // },

  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },

  // verifiedCategory: {
  //   type: String,
  //   default: null,
  // },

  // verifiedAt: {
  //   type: Date,
  //   default: null,
  // },

  // verificationRequestedAt: {
  //   type: Date,
  //   default: null,
  // },

  // isValid: {
  //   type: Boolean,
  //   default: false,
  // },

  // isPrivate: {
  //   type: Boolean,
  //   default: false,
  // },

  // isDeleted: {
  //   type: Boolean,
  //   default: false,
  // },

  // deletedAt: {
  //   type: Date,
  //   default: null,
  // },

  // deletionRequest: {
  //   type: Boolean,
  //   default: false,
  // },

  // deletionRequestedAt: {
  //   type: Date,
  //   default: null,
  // },

  // showOnlineStatus: {
  //   type: Boolean,
  //   default: true,
  // },

  // lastSeen: {
  //   type: Date,
  //   default: null,
  // },

  // accountCreatedIp: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    this.updatedAt = Date.now();
    next();
  }

  this.updatedAt = Date.now();
  this.password = await bcrypt.hash(this.password, 16);
});

// Generate JWT Token
userSchema.methods.generateToken = async function () {
  const token = jwt.sign({
    id: this._id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const decodedData = jwt.decode(token);

  const authToken = await models.AuthToken.create({
    token: token,
    user: this._id,
    expiresAt: decodedData.exp
  });

  return authToken;
};

// Match Password
userSchema.methods.matchPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};


userSchema.index({
  uname: "text",
  fname: "text",
  lname: "text"
});
const User = mongoose.model("User", userSchema);

export default User;