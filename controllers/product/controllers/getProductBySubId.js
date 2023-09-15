import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
// import validators from "../../../../utils/validators.js";

/// @route  GET /api/v1/

const getProductBySubId = catchAsyncError(async (req, res, next) => {
    const { subcategoryId, vendorId } = req.body

    const productsBySubCategory = await models.Product.find({ subcategoryId: subcategoryId })

    const vendor_products = await models.VendorProduct.find({ vendorId: vendorId })

    let resdata = []
    productsBySubCategory.forEach((product) => {
        let found = false;
        let status = false;
        // let avg = 0;
        vendor_products.forEach((vendor_product) => {
            if (vendor_product.productId.equals(product._id)) {
                found = true;
                if (vendor_product.status === "In-Stock") {
                    status = true;
                }
                else status = false;

            }
        })

        resdata.push({
            product: product,
            status: status
        })
    });

    res.json(resdata)


});

export default getProductBySubId;
