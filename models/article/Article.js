import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({


  title: {
    type: String,
    required: true,
    maxlength: 500,
  },

  content: {
    type: String,
    // maxlength: 500,
  },

  imageLink: {
    type: String,
    required: true
  },

  videoLink: {
    type: String,
    // required: true
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  communityId: {
    type: mongoose.Schema.ObjectId,
    ref: "Community",
    required: true,
  },

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

  productLink: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    // required: true,
  },

  topicIdList: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Topic'
    }
  ],

  tagIdList: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tag'
    }
  ],

  status: {
    type: String,
    enum: [
      "active", "inactive"
    ],
    default: "active",
  },

  type: {
    type: String,
    enum: [
      "blog", "post"
    ],
    required: true
  },



  //--------------------------------------------//
  // below here are old mental wellnes schema 
  //--------------------------------------------//




  // content: {
  //   type: String,
  //   maxlength: 500,
  // },

  // mediaFiles: [
  //   {
  //     public_id: String,
  //     url: String,
  //     thumbnail: {
  //       public_id: String,
  //       url: String,
  //     },
  //     mediaType: {
  //       type: String,
  //       enum: [
  //         "image", "video", "gif"
  //       ],
  //       default: "image",
  //     },
  //   }
  // ],

  // pollQuestion: {
  //   type: String,
  //   maxlength: 500,
  // },

  // pollOptions: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "PollOption"
  //   }
  // ],

  // totalVotes: {
  //   type: Number,
  //   default: 0,
  // },

  // pollEndsAt: {
  //   type: Date,
  // },


  // repostsCount: {
  //   type: Number,
  //   default: 0,
  // },

  // sharesCount: {
  //   type: Number,
  //   default: 0,
  // },

  // savesCount: {
  //   type: Number,
  //   default: 0,
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

  // allowComments: {
  //   type: Boolean,
  //   default: true,
  // },

  // allowLikes: {
  //   type: Boolean,
  //   default: true,
  // },

  // allowReposts: {
  //   type: Boolean,
  //   default: true,

  // },

  // allowShare: {
  //   type: Boolean,
  //   default: true,
  // },

  // allowSave: {
  //   type: Boolean,
  //   default: true,
  // },

  // allowDownload: {
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
  }
});

articleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// articleSchema.index({ caption: "text", pollQuestion: "text" });
const Article = mongoose.model("Article", articleSchema);

export default Article;
