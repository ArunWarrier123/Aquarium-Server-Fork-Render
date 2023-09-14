import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({

    phone: String,

    fullname: {
        type: String,
        required: [true, "Please enter your name"],
        // unique: true,
        // trim: true,
        // maxlength: [50, "A tag name cannot be more than 50 characters"],
    },

    pincode: {
        type: Number,
        required: true
    },

    state: {
        type: String,
        // minlength: [3, "First name must be at least 3 characters."],
        required: [true, "Please provide state name."],
    },

    city: {
        type: String,
        // minlength: [3, "First name must be at least 3 characters."],
        required: [true, "Please provide city name."],
    },

    address: {
        type: String,
        required: true
    },

    storename: {
        type: String,
        required: [true, "Please enter your store name"],
        // unique: true,
        // trim: true,
        // maxlength: [50, "A tag name cannot be more than 50 characters"],
    },

    availablePeriod: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        }
    }
    ,

    storeDetails: {
        type: String,
        // required: true
    },

    gstNumber:{
        type: Number,
        required: true
    },

    locationURL: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    rank: {
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

vendorSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
// vendorSchema.index({ name: "text" });
const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;