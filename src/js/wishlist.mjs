import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { renderCartSubscript } from "./cartBadge.mjs";

export function getWishlist() {
  return getLocalStorage("so-wishlist") || [];
}

export function addProductToWishlist(product, color) {
  const wishlist = getWishlist();

  const wishlistItem = {
    Id: product.Id,
    Name: product.NameWithoutBrand,
    Brand: product.Brand.Name,
    FinalPrice: product.FinalPrice,
    SuggestedRetailPrice: product.SuggestedRetailPrice,
    Image: color?.ColorPreviewImageSrc || product.Images.PrimaryLarge,
    ColorName: color?.ColorName || "",
    ColorCode: color?.ColorCode || "default",
    quantity: 1
  };

  const exists = wishlist.find(
    (item) =>
      item.Id === wishlistItem.Id && item.ColorCode === wishlistItem.ColorCode
  );

  if (!exists) {
    wishlist.push(wishlistItem);
    setLocalStorage("so-wishlist", wishlist);
  }
}

export function removeFromWishlist(id, colorCode) {
  let wishlist = getWishlist();

  wishlist = wishlist.filter(
    (item) => !(item.Id === id && item.ColorCode === colorCode)
  );

  setLocalStorage("so-wishlist", wishlist);
}

export function moveWishlistToCart(id, colorCode) {
  const wishlist = getWishlist();
  const cart = getLocalStorage("so-cart") || [];

  const item = wishlist.find(
    (product) => product.Id === id && product.ColorCode === colorCode
  );

  if (!item) return;

  cart.push(item);
  setLocalStorage("so-cart", cart);

  removeFromWishlist(id, colorCode);
  renderCartSubscript();
}

function wishlistItemTemplate(item) {
  return `
    <li class="cart-card divider" data-id="${item.Id}" data-color="${item.ColorCode}">
      <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>

      <a href="../product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">${item.ColorName || ""}</p>

      <div class="cart-card__price">
        <span class="strikethrough">$${item.SuggestedRetailPrice}</span>
        <strong>$${item.FinalPrice}</strong>
      </div>

      <div class="wishlist-actions">
        <button class="wishlist-move" data-id="${item.Id}" data-color="${item.ColorCode}">
          Move to Cart
        </button>
        <button class="wishlist-remove" data-id="${item.Id}" data-color="${item.ColorCode}">
          Remove
        </button>
      </div>
    </li>
  `;
}

export function renderWishlist() {
  const list = getWishlist();
  const container = document.querySelector(".wishlist-list");

  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<p class="wishlist-empty">Your wishlist is empty.</p>`;
    return;
  }

  container.innerHTML = list.map(wishlistItemTemplate).join("");

  container.querySelectorAll(".wishlist-remove").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromWishlist(button.dataset.id, button.dataset.color);
      renderWishlist();
    });
  });

  container.querySelectorAll(".wishlist-move").forEach((button) => {
    button.addEventListener("click", () => {
      moveWishlistToCart(button.dataset.id, button.dataset.color);
      renderWishlist();
    });
  });
}