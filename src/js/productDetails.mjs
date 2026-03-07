import { getLocalStorage, setLocalStorage } from './utils.mjs';
import { findProductById } from './externalServices.mjs';
import { renderCartSubscript } from './cartBadge.mjs';
import { discountPercent } from './utils.mjs';

export default async function productDetails(productId) {
  // Retrieve product details based on the ID in the URL
  const product = await findProductById(productId);

  // Handle cases where the product does not exist
   if (!product) {
    document.querySelector('.product-detail').innerHTML =
      '<strong>Looks like this product packed up and left camp.<br>Please head back and choose from our available inventory.</strong>';

    // Hide Add to Cart button when no valid product exists
    const btn = document.getElementById('addToCart');
    if (btn) btn.style.display = 'none';
    // Stop execution to prevent UI errors
    return; 
  }

  // Render product details and enable add-to-cart functionality
  renderProductDetails(product);
  document.getElementById('addToCart').addEventListener('click', addToCartHandler);

}

function renderProductDetails(product) {
    document.querySelector('#productName').innerText = product.Brand.Name;
    document.querySelector('#productNameWithoutBrand').innerText = product.NameWithoutBrand;
    
    const imageEl = document.querySelector('#productImage');
    imageEl.src = product.Images.PrimaryLarge;
    imageEl.alt = product.Name;

    document.querySelector('#productPrice').innerHTML = `
    <span class = "strikethrough">$${product.SuggestedRetailPrice}</span> $${product.FinalPrice}
    <span class = "percent-off">${discountPercent(product.SuggestedRetailPrice, product.FinalPrice)}% Off!`;

    const colorEl = document.querySelector('#colorSwatchList');
    product.Colors.forEach(color => {
          colorEl.innerHTML += `<li id=${color.ColorCode} class="colorSelector"><img src="${color.ColorChipImageSrc}" class="colorSwatch"/> ${color.ColorName}</li>`;
          console.log(color);
    });
    
    const originalColorCode = document.querySelector('.colorSelector').id;
    const originalColor = product.Colors.find(c => c.ColorCode === originalColorCode);
    document.querySelector('#addToCart').dataset.color = JSON.stringify(originalColor);
    const colorOptions = document.querySelectorAll('.colorSelector');
    colorOptions.forEach(option => { //resets the main image to be the one selected
        option.addEventListener('click', () => {
          const colorCode = option.id;
          const color = product.Colors.find(color => color.ColorCode === colorCode);
          imageEl.src = color.ColorPreviewImageSrc;
          document.querySelector('#addToCart').dataset.color = JSON.stringify(color);
        })
    })

    document.querySelector('#productDescription').innerHTML = product.DescriptionHtmlSimple;
    document.querySelector('#addToCart').dataset.id = product.Id;

    const commentEl = document.querySelector('.allComments');
    const comments = getComments(product.Id);
    comments.forEach(c => {
      commentEl.innerHTML += commentsDiv(c);
    })

    const commentNameEl = document.querySelector('#commentName');
    const commentInputEl = document.querySelector('#addComment');
    const submitComment = document.querySelector('#submitComment');

    submitComment.addEventListener('click', (e) => {
      e.preventDefault();
      const nameToAdd = commentNameEl.value || "Anonymous";
      const commentToAdd = commentInputEl.value;
      if (!commentToAdd.trim()) return;
      saveComments(product.Id, {name: nameToAdd, comment: commentToAdd});
      
      commentEl.innerHTML = '';
      const comments = getComments(product.Id);
      comments.forEach(c => {
        commentEl.innerHTML += commentsDiv(c);
      })
      commentNameEl.value = "";
      commentInputEl.value = "";
    })
}

async function addToCartHandler(e) {
  console.log('Adding product to cart...');
  const product = await findProductById(e.currentTarget.dataset.id);
  const addToCartButton = document.querySelector('#addToCart');
  const color = JSON.parse(addToCartButton.dataset.color);
  addProductToCart(product, color);
  alert(`${product.NameWithoutBrand} successfully added!`);
  // Update Subscript on Cart Addition (DOM reload update already handled).
}

export function addProductToCart(product, color) {
  const cart = getLocalStorage("so-cart") || []; // ✅ now defined
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
  // Resets Cart Animation Class.
  cartObj.classList.remove('cart-animation');
  // Forces animation reset.
  void cartObj.offsetWidth;
  // Re-instates Cart Animation Class.
  cartObj.classList.add('cart-animation');
}

function saveComments(product, comment) {
  const item = localStorage.getItem("comments");
  const comments = item ? JSON.parse(item) : {};

  if (!comments[product]) {
    comments[product] = [];
  }

  comments[product].push(comment);

  setLocalStorage("comments", comments);
}

function getComments(product) {
  const item = localStorage.getItem("comments");
  const comments = item ? JSON.parse(item) : {};
  return comments[product] || [];
}

function commentsDiv(c) {
  return `
    <div class="commentMade">
      <p>${c.name}:</p>
      <p>- ${c.comment}</p>
    </div>
  `;
}