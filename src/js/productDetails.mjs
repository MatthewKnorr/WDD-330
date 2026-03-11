import { getLocalStorage, setLocalStorage } from './utils.mjs';
import { findProductById } from './externalServices.mjs';
import { renderCartSubscript } from './cartBadge.mjs';
import { discountPercent } from './utils.mjs';
import { addProductToWishlist } from './wishlist.mjs';

export default async function productDetails(productId) {
  const product = await findProductById(productId);

  if (!product) {
    document.querySelector('.product-detail').innerHTML =
      '<strong>Looks like this product packed up and left camp.<br>Please head back and choose from our available inventory.</strong>';

    const btn = document.getElementById('addToCart');
    if (btn) btn.style.display = 'none';

    const wishlistBtn = document.getElementById('addToWishlist');
    if (wishlistBtn) wishlistBtn.style.display = 'none';

    return;
  }

  renderProductDetails(product);

  document
    .getElementById('addToCart')
    .addEventListener('click', addToCartHandler);

  const wishlistBtn = document.getElementById('addToWishlist');

  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      const addToCartButton = document.querySelector('#addToCart');
      const color = JSON.parse(addToCartButton.dataset.color);

      addProductToWishlist(product, color);
      alert(`${product.NameWithoutBrand} added to wishlist!`);
    });
  }
}

function renderProductDetails(product) {
  document.querySelector('#productName').innerText = product.Brand.Name;
  document.querySelector('#productNameWithoutBrand').innerText = product.NameWithoutBrand;

  const imageEl = document.querySelector('#productImage');
  imageEl.src = product.Images.PrimaryLarge;
  imageEl.alt = product.Name;

  document.querySelector('#productPrice').innerHTML = `
    <span class="strikethrough">$${product.SuggestedRetailPrice}</span>
    $${product.FinalPrice}
    <span class="percent-off">${discountPercent(product.SuggestedRetailPrice, product.FinalPrice)}% Off!</span>
  `;

  const colorEl = document.querySelector('#colorSwatchList');
  colorEl.innerHTML = "";

  product.Colors.forEach(color => {
    colorEl.innerHTML += `
      <li id="${color.ColorCode}" class="colorSelector">
        <img src="${color.ColorChipImageSrc}" class="colorSwatch"/>
        ${color.ColorName}
      </li>
    `;
  });

  const originalColorCode = document.querySelector('.colorSelector').id;
  const originalColor = product.Colors.find(c => c.ColorCode === originalColorCode);

  document.querySelector('#addToCart').dataset.color = JSON.stringify(originalColor);

  const colorOptions = document.querySelectorAll('.colorSelector');
  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      const colorCode = option.id;
      const color = product.Colors.find(color => color.ColorCode === colorCode);

      imageEl.src = color.ColorPreviewImageSrc;
      document.querySelector('#addToCart').dataset.color = JSON.stringify(color);
    });
  });

  document.querySelector('#productDescription').innerHTML = product.DescriptionHtmlSimple;
  document.querySelector('#addToCart').dataset.id = product.Id;
}

async function addToCartHandler(e) {
  const product = await findProductById(e.currentTarget.dataset.id);
  const addToCartButton = document.querySelector('#addToCart');
  const color = JSON.parse(addToCartButton.dataset.color);

  addProductToCart(product, color);
  alert(`${product.NameWithoutBrand} successfully added!`);
}

export function addProductToCart(product, color) {
  const cart = getLocalStorage("so-cart") || [];

  const cartItem = {
    Id: product.Id,
    Name: product.NameWithoutBrand,
    Brand: product.Brand.Name,
    FinalPrice: product.FinalPrice,
    SuggestedRetailPrice: product.SuggestedRetailPrice,
    Image: color.ColorPreviewImageSrc || product.Images.PrimaryLarge,
    ColorName: color.ColorName,
    ColorCode: color.ColorCode,
    quantity: 1
  };

  cart.push(cartItem);
  setLocalStorage('so-cart', cart);
  renderCartSubscript();

  const cartObj = document.querySelector('.cart');
  if (cartObj) {
    cartObj.classList.remove('cart-animation');
    void cartObj.offsetWidth;
    cartObj.classList.add('cart-animation');
  }
}