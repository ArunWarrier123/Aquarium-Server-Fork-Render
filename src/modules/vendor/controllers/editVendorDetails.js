import catchAsyncError from "../../../helpers/catchAsyncError.js";
import models from "../../../models/index.js";

/// @route  PUT /api/v1/vendor-register

const editVendorDetails = catchAsyncError(async (req, res, next) => {

    const { vendorId } = req.params

    let {
        // email,
        phone,
        fullname,
        pincode,
        state,
        city,
        address,
        storename,
        availablePeriod,
        storeDetails,
        gstNumber,
        locationURL,
        image
    } = req.body;


    const vendornew = await models.Vendor.updateOne({ _id: vendorId }, {

        phone,
        fullname,
        pincode,
        state,
        city,
        address,
        storename,
        availablePeriod,
        storeDetails,
        gstNumber,
        locationURL,
        image,
        // rank: totallength.length + 1
        // role: ,
        // uname,
        // accountCreatedIp: ip,
    });

    res.json(vendornew)

});

export default editVendorDetails;
