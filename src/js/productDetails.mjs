import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { findProductById } from "./productData.mjs";
import { renderCartSubscript } from "./cartBadge.mjs";

export default async function productDetails(productId) {
  // Retrieve product details based on the ID in the URL
  const product = await findProductById(productId);

  // Handle cases where the product does not exist
   if (!product) {
    document.querySelector(".product-detail").innerHTML =
      "<strong>Looks like this product packed up and left camp.<br>Please head back and choose from our available inventory.</strong>";

    // Hide Add to Cart button when no valid product exists
    const btn = document.getElementById("addToCart");
    if (btn) btn.style.display = "none";
    // Stop execution to prevent UI errors
    return; 
  }

  // Render product details and enable add-to-cart functionality
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
  // Update Subscript on Cart Addition (DOM reload update already handled).
}

function addProductToCart(product) {
  const cart = getLocalStorage("so-cart") || []; // ✅ now defined
  cart.push(product);
  setLocalStorage("so-cart", cart);
  renderCartSubscript();
  const cartObj = document.querySelector(".cart");
  // Resets Cart Animation Class.
  cartObj.classList.remove('cart-animation');
  // Forces animation reset.
  void cartObj.offsetWidth;
  // Re-instates Cart Animation Class.
  cartObj.classList.add('cart-animation');
}
