import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    // orderId: { type: Number, required: true },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    productList: [
        {
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true,
            },
            itemCount: {
                type: Number,
                required: true
            },
        }],

    subtotal: {
        type: Number,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    couponId: {
        type: mongoose.Schema.ObjectId,
        // typo variant??? PLZ CHECK BELOW LINE - Arun
        ref: 'Coupon',
        required: true,
    },

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['inprogress', 'cancelled', 'delivered'],
        default: 'inprogress',
    },

    message: {
        type: String
    },

    recipientName: {
        type: String
    },

    recipientPhoneNo: {
        type: String
    },

    locationType: {
        type: String
    },

    addressLine: {
        type: String
    },

    pincode: {
        type: Number
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

orderSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// orderSchema.index({ name: "text" });
const Order = mongoose.model("Order", orderSchema);

export default Order;