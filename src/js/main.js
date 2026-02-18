import { productList } from "./productList.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { displayAlerts } from "./alert.mjs";
import { initBreadcrumb } from "./breadcrumb.mjs";

productList(".product-list", "tents");
displayAlerts();


loadHeaderFooter().then(() => {
  initBreadcrumb();
});

