import { Router } from "express";
import multerMiddleware from "../../../middlewares/multer.js";
import authMiddleware from "../../../middlewares/auth.js";
import productController from "../controllers/index.js";

const productRouter = Router();

const isAuthenticatedVendor = authMiddleware.isAuthenticatedVendor;

// Authorized Routes  -------------------------------------------------------------

productRouter.route("/get-product-bysubid")
    .get( isAuthenticatedVendor , productController.getProductBySubId );

productRouter.route("/get-product-byprodid/:productId/:vendorId")
    .get( isAuthenticatedVendor , productController.getProductbyProdId );

productRouter.route("/get-all-products/:vendorId")
    .get( isAuthenticatedVendor , productController.getAllProducts );



export default productRouter;
