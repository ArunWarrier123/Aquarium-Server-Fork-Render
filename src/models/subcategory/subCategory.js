import mongoose from "mongoose";

const subCategorySchema  = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
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

subCategorySchema .pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// subCategorySchema .index({ name: "text" });
const SubCategory = mongoose.model("SubCategory", subCategorySchema );

export default SubCategory;