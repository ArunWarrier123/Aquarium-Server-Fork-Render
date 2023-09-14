import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
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

addressSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// addressSchema.index({ name: "text" });
const Address = mongoose.model("Address", addressSchema);

export default Address;