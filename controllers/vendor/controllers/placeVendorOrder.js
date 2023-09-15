import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
// import validators from "../../../../utils/validators.js";
// import utility from "../../../../utils/utility.js";
import models from "../../../models/index.js";


const placeVendorOrder = catchAsyncError(async (req, res, next) => {

    const {
        vendorId,
        productList,
        orderTotal,
        deliveryAddress,
    } = req.body
    const allorders = await models.VendorOrder.find({})
    const neworder = await models.VendorOrder.create({
        orderId: allorders?.length + 1,
        vendorId,
        productList,
        orderTotal,
        deliveryAddress
    })

    res.json(neworder)

});

export default placeVendorOrder;
