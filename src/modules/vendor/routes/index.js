import { Router } from "express";
import multerMiddleware from "../../../middlewares/multer.js";
import authMiddleware from "../../../middlewares/auth.js";
import vendorController from "../controllers/index.js";

const vendorRouter = Router();

const isAuthenticatedVendor = authMiddleware.isAuthenticatedVendor;

// Public Routes  -------------------------------------------------------------

vendorRouter.route("/get-all-stores")
  .get( vendorController.getAllVendors );

  // Authenticated Routes -------------------------------------------------------


vendorRouter.route("/get-store/:vendorId")
  .get( isAuthenticatedVendor ,  vendorController.getVendorDetails );

vendorRouter.route("/get-rating/:vendorId")
  .get( isAuthenticatedVendor , vendorController.getVendorRating );

vendorRouter.route("/place-vendor-order")
  .post( isAuthenticatedVendor , vendorController.placeVendorOrder );

vendorRouter.route("/get-vendor-orders/:vendorId")
  .get( isAuthenticatedVendor , vendorController.getAllVendorOrders );

vendorRouter.route("/get-vendor-byOrderId/:orderId")
  .get( isAuthenticatedVendor , vendorController.getVendorOrderbyOrderid );

vendorRouter.route("/edit-vendor/:vendorId")
  .put( isAuthenticatedVendor , vendorController.editVendorDetails );

  vendorRouter.route("/vendor-update-product")
  .put( isAuthenticatedVendor , vendorController.editVendorProductStatus );



export default vendorRouter;
