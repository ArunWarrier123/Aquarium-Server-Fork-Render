import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({

    offerAmt: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    
    code: {
        type: String,
        required: true
    },

    points: {
        type: Number,
        required: true
    },

    valid_from: {
        type: String,
        required: true
    },

    valid_to: {
        type: String,
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

CouponSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// CouponSchema.index({ name: "text" });
const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;