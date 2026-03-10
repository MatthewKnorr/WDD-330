import { getLocalStorage, setLocalStorage, discountPercent } from './utils.mjs';
import { findProductById, getProductsByCategory } from './externalServices.mjs';
import { renderCartSubscript } from './cartBadge.mjs';

export default async function productDetails(productId) {
  const product = await findProductById(productId);

  if (!product) {
    document.querySelector('.product-detail').innerHTML =
      '<strong>Looks like this product packed up and left camp.<br>Please head back and choose from our available inventory.</strong>';

    const btn = document.getElementById('addToCart');
    if (btn) btn.style.display = 'none';
    return;
  }

  await renderProductDetails(product);
  document.getElementById('addToCart').addEventListener('click', addToCartHandler);
}

async function renderProductDetails(product) {
  document.querySelector('#productName').innerText = product.Brand.Name;
  document.querySelector('#productNameWithoutBrand').innerText = product.NameWithoutBrand;

  const imageEl = document.querySelector('#productImage');
  const thumbnailListEl = document.querySelector('#imageThumbnailList');
  const colorEl = document.querySelector('#colorSwatchList');
  const addToCartBtn = document.querySelector('#addToCart');
  const commentEl = document.querySelector('.allComments');
  const commentNameEl = document.querySelector('#commentName');
  const commentInputEl = document.querySelector('#addComment');
  const submitComment = document.querySelector('#submitComment');

  colorEl.innerHTML = '';
  thumbnailListEl.innerHTML = '';
  commentEl.innerHTML = '';

  imageEl.src = product.Images.PrimaryLarge;
  imageEl.alt = product.Name;

  document.querySelector('#productPrice').innerHTML = `
    <span class="strikethrough">$${product.SuggestedRetailPrice}</span> $${product.FinalPrice}
    <span class="percent-off">${discountPercent(product.SuggestedRetailPrice, product.FinalPrice)}% Off!</span>
  `;

  const imageOptions = [
    {
      src: product.Images.PrimaryLarge,
      thumb: product.Images.PrimarySmall || product.Images.PrimaryLarge,
      alt: product.Name
    }
  ];

  if (product.Images.ExtraImages && product.Images.ExtraImages.length > 0) {
    product.Images.ExtraImages.forEach((img) => {
      imageOptions.push({
        src: img.Src,
        thumb: img.Src,
        alt: img.Title || product.Name
      });
    });
  }

  if (imageOptions.length > 1) {
    imageOptions.forEach((img, index) => {
      const thumbBtn = document.createElement('button');
      thumbBtn.type = 'button';
      thumbBtn.classList.add('image-thumb');

      if (index === 0) thumbBtn.classList.add('active');

      thumbBtn.innerHTML = `<img src="${img.thumb}" alt="${img.alt}">`;

      thumbBtn.addEventListener('click', () => {
        imageEl.src = img.src;
        imageEl.alt = img.alt;

        document.querySelectorAll('.image-thumb').forEach((btn) => btn.classList.remove('active'));
        thumbBtn.classList.add('active');
      });

      thumbnailListEl.appendChild(thumbBtn);
    });
  }

  if (product.Colors && product.Colors.length > 0) {
    product.Colors.forEach((color) => {
      colorEl.innerHTML += `
        <li id="${color.ColorCode}" class="colorSelector">
          <img src="${color.ColorChipImageSrc}" class="colorSwatch" alt="${color.ColorName}" />
          ${color.ColorName}
        </li>
      `;
    });

    const firstColorOption = document.querySelector('.colorSelector');
    if (firstColorOption) {
      const originalColorCode = firstColorOption.id;
      const originalColor = product.Colors.find((c) => c.ColorCode === originalColorCode);
      addToCartBtn.dataset.color = JSON.stringify(originalColor);
    }

    const colorOptions = document.querySelectorAll('.colorSelector');
    colorOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const colorCode = option.id;
        const color = product.Colors.find((c) => c.ColorCode === colorCode);

        if (color?.ColorPreviewImageSrc) {
          imageEl.src = color.ColorPreviewImageSrc;
          imageEl.alt = `${product.Name} - ${color.ColorName}`;
        }

        addToCartBtn.dataset.color = JSON.stringify(color);
      });
    });
  } else {
    addToCartBtn.dataset.color = JSON.stringify({
      ColorName: 'Default',
      ColorCode: 'DEFAULT',
      ColorPreviewImageSrc: product.Images.PrimaryLarge
    });
  }

  document.querySelector('#productDescription').innerHTML = product.DescriptionHtmlSimple;
  addToCartBtn.dataset.id = product.Id;

  const comments = getComments(product.Id);
  comments.forEach((c) => {
    commentEl.innerHTML += commentsDiv(c);
  });

  submitComment.addEventListener('click', (e) => {
    e.preventDefault();

    const nameToAdd = commentNameEl.value || 'Anonymous';
    const commentToAdd = commentInputEl.value;
    if (!commentToAdd.trim()) return;

    saveComments(product.Id, { name: nameToAdd, comment: commentToAdd });

    commentEl.innerHTML = '';
    const updatedComments = getComments(product.Id);
    updatedComments.forEach((c) => {
      commentEl.innerHTML += commentsDiv(c);
    });

    commentNameEl.value = '';
    commentInputEl.value = '';
  });

  const products = await getProductsByCategory('sleeping-bags');
  renderRecommendations(products, product.Id);
}

async function addToCartHandler(e) {
  const product = await findProductById(e.currentTarget.dataset.id);
  const addToCartButton = document.querySelector('#addToCart');
  const color = JSON.parse(addToCartButton.dataset.color);

  addProductToCart(product, color);
  alert(`${product.NameWithoutBrand} successfully added!`);
}

export function addProductToCart(product, color) {
  const cart = getLocalStorage('so-cart') || [];

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

function saveComments(product, comment) {
  const item = localStorage.getItem('comments');
  const comments = item ? JSON.parse(item) : {};

  if (!comments[product]) {
    comments[product] = [];
  }

  comments[product].push(comment);
  setLocalStorage('comments', comments);
}

function getComments(product) {
  const item = localStorage.getItem('comments');
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

function getRandomRecommendations(products, currentProductId) {
  const filteredProducts = products.filter((product) => product.Id !== currentProductId);

  const shuffled = [...filteredProducts].sort(() => Math.random() - 0.5);
  const count = Math.min(filteredProducts.length, Math.floor(Math.random() * 2) + 2);

  return shuffled.slice(0, count);
}

function renderRecommendations(products, currentProductId) {
  const recommendedEl = document.querySelector('#recommendedProducts');
  if (!recommendedEl) return;

  recommendedEl.innerHTML = '';

  const recommendations = getRandomRecommendations(products, currentProductId);

  recommendations.forEach((product) => {
    recommendedEl.innerHTML += `
      <article class="product-card recommended-card">
        <a href="../product_pages/index.html?product=${product.Id}">
          <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" class="recommended-card__image" />
          <h4 class="recommended-card__name">${product.NameWithoutBrand}</h4>
          <p class="recommended-card__price">$${product.FinalPrice}</p>
        </a>
      </article>
    `;
  });
}