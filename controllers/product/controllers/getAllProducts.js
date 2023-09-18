import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
// import validators from "../../../../utils/validators.js";

/// @route  GET /api/v1/

const getAllProducts = catchAsyncError(async (req, res, next) => {

    const products = await models.Product.find({  })
    
    res.json(products)


});

export default getAllProducts;
