import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
// import validators from "../../../../utils/validators.js";
// import utility from "../../../../utils/utility.js";
import models from "../../../models/index.js";


const getVendorRating = catchAsyncError(async (req, res, next) => {

    const { vendorId } = req.params

    // const vendorData = await models.Vendor.find({ _id: vendorId });

    const ratings = await models.Rating.find({ vendorId: vendorId });

    // let cnt = 0;
    let avg = 0;
    // let reviews = [];
    ratings.forEach((rating) => {

        //     //this means the rating was given for current store
        avg += rating.rating
        //     reviews.push(rating)
    })

    // //u have the total no. of ratings for curr store and the sum of all so u get avg now
    if (ratings?.length !== 0) avg /= ratings.length;


    res.json({
        reviews: ratings,
        average: avg,
        total: ratings.length,
        // reviews: ratings
    })

});

export default getVendorRating;
