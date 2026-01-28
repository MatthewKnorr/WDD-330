import { render } from "sass";
import { getLocalStorage, setLocalStorage } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart"); // always an array now
  const htmlItems = cartItems.map(cartItemTemplate);
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#"><h2 class="card__name">${item.Name}</h2></a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <span data-id="${item.Id}">X</span>
  </li>`;
}

function getTotal() {
  const cartItems = getLocalStorage("so-cart");
  console.log(cartItems);
  let total = 0;
  cartItems.forEach((item) => {
    console.log(item.FinalPrice);
    total += item.FinalPrice;
  });

  console.log(total);
  return total;
}

function renderTotal() {
  const total = getTotal();
  const htmlTotal = document.querySelector(".cart-total");
  const totalDiv = document.querySelector(".cart-footer");
  if (total == 0) {
    totalDiv.classList.add("hide");
  } else {
    totalDiv.classList.remove("hide");
    htmlTotal.textContent = `Total: $${total}`;
  }
}

function filterItem(array, removedId) {
  return array.filter(item => item.Id !== removedId);
}

function handleRemovingItem(e) {
  const id = e.target.dataset.id;

  let cartItems = getLocalStorage('so-cart');
  cartItems = filterItem(cartItems, id);
  setLocalStorage('so-cart', cartItems);

  renderCartContents();
  renderTotal();
}

renderCartContents();
renderTotal();

const cartContainer = document.querySelector('.product-list');
cartContainer.addEventListener('click', function(e) {
  if (e.target.matches('span[data-id')) {
    handleRemovingItem(e);
  }
})
