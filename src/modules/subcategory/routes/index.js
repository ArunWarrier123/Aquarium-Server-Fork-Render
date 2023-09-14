import { Router } from "express";
import multerMiddleware from "../../../middlewares/multer.js";
import authMiddleware from "../../../middlewares/auth.js";
import subcategoryController from "../controllers/index.js";
// import vendorController from "../controllers/index.js";

const subCategoryRouter = Router();

const isAuthenticatedVendor = authMiddleware.isAuthenticatedVendor;

// Authenticated Routes -------------------------------------------------------

subCategoryRouter.route("/get-subcategory-bycatid/:categoryId")
  .get( isAuthenticatedVendor , subcategoryController.getAllSubByCatId );



export default subCategoryRouter;
