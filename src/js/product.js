import { loadHeaderFooter, getParam } from "./utils.mjs";
import productDetails from "./productDetails.mjs";
import { initBreadcrumb } from "./breadcrumb.mjs";

loadHeaderFooter().then(() => {
  const productId = getParam("product");
  productDetails(productId);

  // Give productDetails a moment to render product name
  setTimeout(() => {
    initBreadcrumb();
  }, 150);
});