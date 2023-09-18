import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
// import validators from "../../../../utils/validators.js";

/// @route  GET /api/v1/

const getProductbyProdId = catchAsyncError(async (req, res, next) => {
    const { productId, vendorId } = req.params

    const productdata = await models.Product.find({ _id: productId })

    const vendor_product = await models.VendorProduct.findOne({ vendorId: vendorId })
    let status;
    if (!vendor_product) {
        status = false;
    }
    else {
        if (vendor_product.productId.equals(productId)) {
            if (vendor_product.status === "In-Stock") {
                status = true;
            }
            else status = false;
        }

    }


    res.json({
        product: productdata,
        status: status
    })




});

export default getProductbyProdId;
