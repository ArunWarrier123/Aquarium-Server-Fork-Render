import catchAsyncError from "../../../helpers/catchAsyncError.js";
import models from "../../../models/index.js";

/// @route  PUT /api/v1/vendor-update-product

const editVendorProductStatus = catchAsyncError(async (req, res, next) => {

    const {
        vendorId,
        productId,
        status
    } = req.body

    const entryexists = await models.VendorProduct.findOne({ vendorId: vendorId, productId, productId })

    if (entryexists) {
        const vendorproductupdated = await models.VendorProduct.updateOne({ vendorId: vendorId, productId: productId }, {
            status: status
        });
        res.json(vendorproductupdated)

    }
    else {
        const newentry = await models.VendorProduct.create({
            vendorId: vendorId, 
            productId: productId,
            status: status
        })

        res.json(newentry)
    }



});

export default editVendorProductStatus;
