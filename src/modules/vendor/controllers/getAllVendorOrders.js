import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
// import validators from "../../../../utils/validators.js";
// import utility from "../../../../utils/utility.js";
import models from "../../../models/index.js";


const getAllVendorOrders = catchAsyncError(async (req, res, next) => {

    const { vendorId } = req.params

    const orders = await models.VendorOrder.find({ vendorId: vendorId });

    res.json(orders)

});

export default getAllVendorOrders;
