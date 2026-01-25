import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { findProductById } from "./productData.mjs";

export default async function productDetails(productId) {
  // use findProductById to get the details for the current product. findProductById will return a promise! use await or .then() to process it
  // once we have the product details we can render out the HTML
  // add a listener to Add to Cart button
  const product = await findProductById(productId);
  renderProductDetails(product);
  document.getElementById("addToCart").addEventListener("click", addToCartHandler);
}

function renderProductDetails(product) {
    document.querySelector('#productName').innerText = product.Brand.Name;
    document.querySelector('#productNameWithoutBrand').innerText = product.NameWithoutBrand;
    document.querySelector('#productImage').src = product.Image;
    document.querySelector('#productImage').alt = product.Name;
    document.querySelector('#productPrice').innerText = product.FinalPrice;
    document.querySelector('#productColor').innerText = product.Colors[0].ColorName;
    document.querySelector('#productDescription').innerHTML = product.DescriptionHtmlSimple;
    document.querySelector('#addToCart').dataset.id = product.Id;
}

async function addToCartHandler(e) {
  console.log("Adding product to cart...");
  const product = await findProductById(e.currentTarget.dataset.id);
  console.log(product);
  addProductToCart(product);
}

function addProductToCart(product) {
  const cart = getLocalStorage("so-cart") || []; // ✅ now defined
  cart.push(product);
  setLocalStorage("so-cart", cart);
}