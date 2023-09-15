import mongoose from "mongoose";

const vendorOrderSchema = new mongoose.Schema({

    orderId: {
        type: Number,
        required: true
    },

    vendorId: {
        type: mongoose.Schema.ObjectId,
        ref: "Vendor"
    },

    productList: [
        {
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number
            }

        }
    ],

    orderTotal: {
        type: Number,
        required: true
    },

    deliveryAddress: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['in_progress', 'cancelled', 'delivered'],
        default: 'in_progress',
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

vendorOrderSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

vendorOrderSchema.index({ name: "text" });
const VendorOrder = mongoose.model("VendorOrder", vendorOrderSchema);

export default VendorOrder;