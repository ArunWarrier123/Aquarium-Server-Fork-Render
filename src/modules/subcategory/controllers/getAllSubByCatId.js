import catchAsyncError from "../../../helpers/catchAsyncError.js";
// import ErrorHandler from "../../../../helpers/errorHandler.js";
// import validators from "../../../../utils/validators.js";
// import utility from "../../../../utils/utility.js";
import models from "../../../models/index.js";


const getAllSubByCatId = catchAsyncError(async (req, res, next) => {
    const { categoryId } = req.params

    const subcategories = await models.SubCategory.find({ categoryId: categoryId })

    res.json(subcategories)

});

export default getAllSubByCatId;
