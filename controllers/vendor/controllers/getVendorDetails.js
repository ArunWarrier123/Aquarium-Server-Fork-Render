import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
// import validators from "../../../../utils/validators.js";
// import utility from "../../../../utils/utility.js";
import models from "../../../models/index.js";


const getVendorDetails = catchAsyncError(async (req, res, next) => {

    const { vendorId } = req.params

    const vendorData = await models.Vendor.find({ _id: vendorId });


    const ratings = await models.Rating.find();

    let resdata = []
    let cnt = 0;
    let avg = 0;
    ratings.forEach((rating) => {
        if (rating.vendorId.equals(vendorId)) {
            //this means the rating was given for current store
            cnt++;
            avg += rating.rating
        }
    })

    //u have the total no. of ratings for curr store and the sum of all so u get avg now
    if (cnt !== 0) avg /= cnt;

    resdata.push({
        vendor: vendorData,
        average: avg,
        total: cnt
    })


    res.json({
        result: resdata,
        // average: avg,
        // total: ratings.length,
        // reviews: ratings
    })

});

export default getVendorDetails;
