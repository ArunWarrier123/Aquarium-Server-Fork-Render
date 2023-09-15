import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
// import validators from "../../../../utils/validators.js";
// import utility from "../../../../utils/utility.js";
import models from "../../../models/index.js";


const getVendorDetails = catchAsyncError(async (req, res, next) => {

    const { vendorId } = req.params

    const vendorData = await models.Vendor.find({ _id: vendorId });



    res.json({
        vendor: vendorData,
        // average: avg,
        // total: ratings.length,
        // reviews: ratings
    })

});

export default getVendorDetails;
