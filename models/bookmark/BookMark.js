import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    bookmarkList_name: {
        type: String,
        required: true,
    },

    articlesList: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Article",
            // required: true,
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

bookmarkSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const BookMark = mongoose.model("BookMark", bookmarkSchema);

export default BookMark;
