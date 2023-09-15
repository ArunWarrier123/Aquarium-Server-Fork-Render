import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
// import validators from "../../../../utils/validators.js";
// import utility from "../../../../utils/utility.js";
import models from "../../../models/index.js";


const getAllCategories = catchAsyncError(async (req, res, next) => {

    const categories = await models.Category.find({});

    res.json({"categories": categories})

});

export default getAllCategories;
