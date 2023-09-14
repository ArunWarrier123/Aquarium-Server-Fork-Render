import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },

    subcategoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    mrpPrice: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        required: true
    },
    sales: {
        type: Number,
        default: 0
    },

    description: {
        type: String,
        required: true
    },

    // buyinglimit: { type: Number },
    // stocklimit: { type: Number, required: true },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
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

ProductSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// ProductSchema.index({ name: "text" });
const Product = mongoose.model("Product", ProductSchema);

export default Product;