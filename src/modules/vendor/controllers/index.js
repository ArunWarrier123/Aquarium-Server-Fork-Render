import editVendorDetails from "./editVendorDetails.js";
import editVendorProductStatus from "./editVendorProductStatus.js";
import getAllVendorOrders from "./getAllVendorOrders.js";
import getAllVendors from "./getAllVendors.js";
import getVendorDetails from "./getVendorDetails.js";
import getVendorOrderbyOrderid from "./getVendorOrderbyOrderid.js";
import getVendorRating from "./getVendorRating.js";
import placeVendorOrder from "./placeVendorOrder.js";

const vendorController = {};

vendorController.getAllVendors = getAllVendors;
vendorController.getVendorDetails = getVendorDetails;
vendorController.getVendorRating = getVendorRating;
vendorController.placeVendorOrder = placeVendorOrder;
vendorController.getAllVendorOrders = getAllVendorOrders;
vendorController.getVendorOrderbyOrderid = getVendorOrderbyOrderid;
vendorController.editVendorDetails = editVendorDetails;
vendorController.editVendorProductStatus = editVendorProductStatus;



export default vendorController;
