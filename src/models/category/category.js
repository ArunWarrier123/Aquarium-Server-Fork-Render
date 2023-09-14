import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({


    name: {
        type: String, required: true
    },
    imageURL: {
        type: String, required: true
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

categorySchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// categorySchema .index({ name: "text" });
const Category = mongoose.model("Category", categorySchema);

export default Category;