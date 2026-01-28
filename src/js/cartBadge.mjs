import { getLocalStorage } from "./utils.mjs";

export function renderCartSubscript() {
  const cartItems = getLocalStorage("so-cart") || [];
  const subBadge = document.querySelector(".subscript");
  if (!subBadge) return;

  const count = cartItems.length;
  subBadge.textContent = count;
  subBadge.classList.toggle("hide", count === 0);
}
