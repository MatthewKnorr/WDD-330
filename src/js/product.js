import { getParam } from "./utils.mjs";
import productDetails from "./productDetails.mjs";

const productId = getParam("product");
// console.log(findProductById(productId));
productDetails(productId);
