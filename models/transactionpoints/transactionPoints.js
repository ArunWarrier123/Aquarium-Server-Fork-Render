import mongoose from "mongoose";

const transactionPointsSchema = new mongoose.Schema({

    type: {
        type: String,
        enum: ['article_share', 'post_comment'],
        required: true
        // default: 'pending',
    },

    points:{
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

transactionPointsSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// transactionPointsSchema.index({ name: "text" });
const TransactionPoints = mongoose.model("TransactionPoint", transactionPointsSchema);

export default TransactionPoints;