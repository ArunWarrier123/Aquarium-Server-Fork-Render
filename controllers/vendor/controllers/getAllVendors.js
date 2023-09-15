import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
// import validators from "../../../../utils/validators.js";
// import utility from "../../../../utils/utility.js";
import models from "../../../models/index.js";


const getAllVendors = catchAsyncError(async (req, res, next) => {

    const vendors = await models.Vendor.find();

    const ratings = await models.Rating.find();

    let resdata = []
    vendors.forEach((store) => {
        let cnt = 0;
        let avg = 0;
        ratings.forEach((rating) => {
            if (rating.vendorId.equals(store._id)) {
                //this means the rating was given for current store
                cnt++;
                avg += rating.rating
            }
        })

        //u have the total no. of ratings for curr store and the sum of all so u get avg now
        if (cnt !== 0) avg /= cnt;

        resdata.push({
            vendor: store,
            average: avg,
            total: cnt
        })
    });

    res.json(resdata)

});

export default getAllVendors;
