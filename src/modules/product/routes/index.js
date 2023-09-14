import { Router } from "express";
import multerMiddleware from "../../../middlewares/multer.js";
import authMiddleware from "../../../middlewares/auth.js";
import productController from "../controllers/index.js";

const productRouter = Router();

const isAuthenticatedVendor = authMiddleware.isAuthenticatedVendor;

// Authorized Routes  -------------------------------------------------------------

productRouter.route("/get-product-bysubid")
    .get( isAuthenticatedVendor , productController.getProductBySubId );

productRouter.route("/get-product-byprodid/:productId")
    .get( isAuthenticatedVendor , productController.getProductbyProdId );



export default productRouter;
