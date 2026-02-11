import { productList } from "./productList.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { displayAlerts } from "./alert.mjs";
import { getParam } from "./utils.mjs";

loadHeaderFooter();

const productType = getParam("page");
productList(".product-list", productType);

displayAlerts();