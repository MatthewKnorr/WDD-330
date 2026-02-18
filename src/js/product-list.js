import { productList } from "./productList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";
import { displayAlerts } from "./alert.mjs";
import { initBreadcrumb } from "./breadcrumb.mjs";

const productType = getParam("page");

loadHeaderFooter().then(() => {
  productList(".product-list", productType);

  const titleEl = document.querySelector("#product-title");
  const formattedTitle = productType.replace(/-/g, " ");
  titleEl.innerHTML = formattedTitle;

  displayAlerts();

  setTimeout(() => {
    initBreadcrumb();
  }, 150);
});
