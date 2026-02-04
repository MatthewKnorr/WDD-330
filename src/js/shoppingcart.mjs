import { getData, getLocalStorage } from './utils.mjs';
import { renderListWithTemplate } from './utils.mjs';

function cartItemTemplate(item) {
    return `<li class="cart-card">
           <img src="${item.Image}" alt="${item.Name}"/>
           <div class="class-card__details">
           <h2 class="cart-card__name">${item.Name}</h2>
           <p class"cart-card__price">$${item.FinalPrice}</p>
           </div>
          </li>`
}

export function renderCart() {
    const cartItems = getLocalStorage("so-cart") || [];

    const cartListElement = document.querySelector(".product-list");

    if (cartItems.length === 0) {
        cartListElement.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    renderListWithTemplate(
        cartItemTemplate,
        cartListElement,
        cartItems
    );
}