import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
// import validators from "../../../../utils/validators.js";

/// @route  GET /api/v1/

const getProductbyProdId = catchAsyncError(async (req, res, next) => {
    const { productId } = req.params

    const productdata = await models.Product.find({ _id: productId })
    
    res.json(productdata)


});

export default getProductbyProdId;
