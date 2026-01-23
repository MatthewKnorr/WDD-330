import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import { findProductById } from "./productData.mjs";

function addProductToCart(product) {
  const cart = getLocalStorage("so-cart"); // ✅ now defined
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

async function addToCartHandler(e) {
  console.log("Adding product to cart...");
  const product = await findProductById(e.currentTarget.dataset.id);
  console.log(product);
  addProductToCart(product);
}

document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

const productId = getParam("product");
console.log(findProductById(productId));
