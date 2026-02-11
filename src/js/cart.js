import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { renderCartSubscript } from "./cartBadge.mjs";

function normalizeCart(cart) {
  const map = {};

  cart.forEach((item) => {
    if (!map[item.Id]) {
      map[item.Id] = { ...item, quantity: item.quantity || 1 };
    } else {
      map[item.Id].quantity += item.quantity || 1;
    }
  });

  return Object.values(map);
}

function getCart() {
  return getLocalStorage("so-cart") || [];
}

function renderCartContents() {
  const cartItems = getCart();
  const htmlItems = cartItems.map(cartItemTemplate);
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const qty = item.quantity || 1;
  const originalTotal = (item.SuggestedRetailPrice * qty).toFixed(2);
  const discountedTotal = (item.FinalPrice * qty).toFixed(2);

  return `<li class="cart-card divider" data-id="${item.Id}">
    <a href="#" class="cart-card__image">
      <img src="${item.Images?.PrimaryLarge || item.Image}" alt="${item.Name}" />
    </a>
    <a href="#"><h2 class="card__name">${item.Name}</h2></a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
    <div class="cart-card__quantity">
      <input type="number" min="1" value="${qty}" data-id="${item.Id}" />
    </div>
    <div class="cart-card__price">
      <span class="strikethrough">$${originalTotal}</span>
      <strong>$${discountedTotal}</strong>
    </div>
    <span data-id="${item.Id}">X</span>
  </li>`;
}

function getTotals() {
  const cartItems = getCart();
  let total = 0;

  cartItems.forEach((item) => {
    total += item.FinalPrice * (item.quantity || 1);
  });

  return total;
}

function getSavings() {
  const cartItems = getCart();
  let savings = 0;

  cartItems.forEach((item) => {
    const qty = item.quantity || 1;
    const original = item.SuggestedRetailPrice * qty;
    const discounted = item.FinalPrice * qty;
    savings += original - discounted;
  });

  return savings;
}

function renderTotal() {
  const total = getTotals();
  const savings = getSavings();

  const totalDiv = document.querySelector(".cart-footer");
  const htmlTotal = document.querySelector(".cart-total");

  if (!totalDiv || !htmlTotal) return;

  if (total === 0) {
    totalDiv.classList.add("hide");
    return;
  }

  totalDiv.classList.remove("hide");

  let savingsEl = document.querySelector(".cart-savings");

  if (!savingsEl) {
    savingsEl = document.createElement("p");
    savingsEl.classList.add("cart-savings");
    totalDiv.insertBefore(savingsEl, htmlTotal);
  }

  if (savings > 0) {
    savingsEl.textContent = `You saved: $${savings.toFixed(2)}!`;
  } else {
    savingsEl.textContent = "";
  }

  htmlTotal.textContent = `Total: $${total.toFixed(2)}`;
}

function handleRemovingItemById(id) {
  const cartItems = getCart().filter((item) => item.Id !== id);
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  renderTotal();
  renderCartSubscript();
}

function handleQuantityChange(e) {
  if (!e.target.matches(".cart-card__quantity input")) return;

  const id = e.target.dataset.id;
  let qty = parseInt(e.target.value, 10);

  if (isNaN(qty) || qty < 1) {
    handleRemovingItemById(id);
    return;
  }

  const cartItems = getCart();
  const item = cartItems.find((i) => i.Id === id);
  if (!item) return;

  item.quantity = qty;
  setLocalStorage("so-cart", cartItems);

  renderTotal();
  renderCartSubscript();
}

document.addEventListener("DOMContentLoaded", () => {
  const initialCart = normalizeCart(getLocalStorage("so-cart") || []);
  setLocalStorage("so-cart", initialCart);

  renderCartContents();
  renderTotal();
  renderCartSubscript();

  const cartContainer = document.querySelector(".product-list");

  cartContainer.addEventListener("click", (e) => {
    if (e.target.matches("span[data-id]")) {
      handleRemovingItemById(e.target.dataset.id);
    }
  });

  cartContainer.addEventListener("change", handleQuantityChange);
});
