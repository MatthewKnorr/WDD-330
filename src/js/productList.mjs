import { getData, findProductById } from './productData.mjs';
import { renderListWithTemplate } from './utils.mjs';
import { discountPercent} from './utils.mjs';

function productCard(product){
  return `<li class="product-card">
            <a href="product_pages/index.html?product=${product.Id}">
            <img
              src='${product.Image}'
              alt='${product.Name}'
            />
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <h2 class="card__name">${product.NameWithoutBrand}</h2>

            <button class="quick-view" id=${product.Id}>Quick View</button>

            <p class="product-card__price">
            <span class = "strikethrough"> $${product.SuggestedRetailPrice}</span> $${product.FinalPrice}
            <span class = "percent-off"> Save ${discountPercent(product.SuggestedRetailPrice, product.FinalPrice)}%</p>
            </a>
          </li>`
}

function productModal(product) {
  return `
    <dialog class="product-detail">
        <button class="closeModal">X</button>
        <h3 id="productName">${product.Brand.Name}</h3>

        <h2 class="divider" id="productNameWithoutBrand">${product.NameWithoutBrand}</h2>

        <img class="divider" src="${product.Image}" alt="${product.Name}" id="productImage" />

        <p class="product-card__price" id="productPrice">
          <span class = "strikethrough">$${product.SuggestedRetailPrice}</span> $${product.FinalPrice}
          <span class = "percent-off">${discountPercent(product.SuggestedRetailPrice, product.FinalPrice)}% Off!
        </p>

        <p class="product__color" id="productColor">${product.Colors[0].ColorName}</p>

        <p class="product__description" id="productDescription">${product.DescriptionHtmlSimple}</p>

        <div class="product-detail__add">
          <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
        </div>
      </dialog>
  `
}

function renderModal(product) {
  const mainEl = document.querySelector('main');
  mainEl.insertAdjacentHTML('beforeend', productModal(product));
  const dialog = document.querySelector('dialog');
  dialog.showModal();

  const close = document.querySelector('.closeModal');
  close.addEventListener('click', () => {
    dialog.close();
  })
}

export async function productList(selector, category){
  const el = document.querySelector(selector);
  const products = await getData(category);
  console.log(products);

  // Rendering
  renderListWithTemplate(productCard, el, products)

  // Set up buttons
  const buttons = document.querySelectorAll('.quick-view');
  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      event.preventDefault();
      const product = await findProductById(button.id);
      renderModal(product);
    })
  })

  /*
  console.log(products);
  products.forEach(tent => {
    const card = productCard(tent);
    cardList += card;
  });
  selector.insertAdjacentHTML("beforeend", cardList);
  */
}
