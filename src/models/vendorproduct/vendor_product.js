import mongoose from "mongoose";

const vendorProductSchema = new mongoose.Schema({

    vendorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendor',
        required: true
    },

    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },

    status: {
        type: String,
        enum: ['In-Stock', 'Stock-Out'],
        default: 'Stock-Out',
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

vendorProductSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// vendorProductSchema.index({ name: "text" });
const VendorProduct = mongoose.model("VendorProduct", vendorProductSchema);

export default VendorProduct;