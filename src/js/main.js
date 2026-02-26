import { productList } from "./productList.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { displayAlerts, displayCallToAction } from "./alert.mjs";
import { initBreadcrumb } from "./breadcrumb.mjs";
import { initNewsLetter } from "./newsletter.mjs";
productList(".product-list", "tents");
displayAlerts();
displayCallToAction();

loadHeaderFooter().then(() => {
  initBreadcrumb();
  initNewsLetter();
});

