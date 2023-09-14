import { Router } from "express";
import multerMiddleware from "../../../middlewares/multer.js";
import authMiddleware from "../../../middlewares/auth.js";
import categoryController from "../controllers/index.js";

const categoryRouter = Router();

const isAuthenticatedVendor = authMiddleware.isAuthenticatedVendor;

// Authorized Routes  -------------------------------------------------------------

categoryRouter.route("/get-all-categories")
    .get( isAuthenticatedVendor ,  categoryController.getAllCategories );


export default categoryRouter;
