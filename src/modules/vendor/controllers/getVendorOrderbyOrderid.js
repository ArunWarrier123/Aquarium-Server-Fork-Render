import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
// import validators from "../../../../utils/validators.js";
// import utility from "../../../../utils/utility.js";
import models from "../../../models/index.js";


const getVendorOrderbyOrderid = catchAsyncError(async (req, res, next) => {

    const { orderId } = req.params

    const orderdata = await models.VendorOrder.findOne({ _id: orderId });

    res.json(orderdata)

});

export default getVendorOrderbyOrderid;
