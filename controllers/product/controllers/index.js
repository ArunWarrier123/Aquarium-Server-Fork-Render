import getAllProducts from "./getAllProducts.js";
import getProductBySubId from "./getProductBySubId.js";
import getProductbyProdId from "./getProductbyProdId.js";

const productController = {};

productController.getProductBySubId = getProductBySubId;
productController.getProductbyProdId = getProductbyProdId;
productController.getAllProducts = getAllProducts


export default productController;
