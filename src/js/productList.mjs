import { getData } from './productData.mjs';
import { renderListWithTemplate, discountPercent } from './utils.mjs';

function productCard(product){
  return `<li class="product-card">
            <a href="product_pages/index.html?product=${product.Id}">
            <img
              src='${product.Image}'
              alt='${product.Name}'
            />
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <h2 class="card__name">${product.NameWithoutBrand}</h2>

            <p class="product-card__price">
            <span class="strikethrough">$${product.SuggestedRetailPrice}</span> 
            $${product.FinalPrice}
            <span class="percent-off">
              Save ${discountPercent(product.SuggestedRetailPrice, product.FinalPrice)}%
            </span>
            </p>
            </a>
          </li>`
}

function sortProducts(products, criteria){
  const sorted = [...products];

  switch(criteria){
    case "price-low":
      sorted.sort((a,b) => a.FinalPrice - b.FinalPrice);
      break;

    case "price-high":
      sorted.sort((a,b) => b.FinalPrice - a.FinalPrice);
      break;

    case "discount":
      sorted.sort((a,b) => {
        const discountA = (a.SuggestedRetailPrice - a.FinalPrice) / a.SuggestedRetailPrice;
        const discountB = (b.SuggestedRetailPrice - b.FinalPrice) / b.SuggestedRetailPrice;
        return discountB - discountA;
      });
      break;

    case "name-asc":
      sorted.sort((a,b) =>
        a.NameWithoutBrand.localeCompare(b.NameWithoutBrand)
      );
      break;

    case "name-desc":
      sorted.sort((a,b) =>
        b.NameWithoutBrand.localeCompare(a.NameWithoutBrand)
      );
      break;

    case "brand":
      sorted.sort((a,b) =>
        a.Brand.Name.localeCompare(b.Brand.Name)
      );
      break;
  }

  return sorted;
}

function filterProducts(products, searchTerm){
  const term = searchTerm.toLowerCase();

  return products.filter(product =>
    product.NameWithoutBrand.toLowerCase().includes(term) ||
    product.Brand.Name.toLowerCase().includes(term)
  );
}

function createControls(container, products){
  const controlsDiv = document.createElement("div");
  controlsDiv.classList.add("controls");

  controlsDiv.innerHTML = `
    <input type="text" id="search-input" placeholder="Search products..." />
    
    <select id="sort-select">
      <option value="">Sort By</option>
      <option value="price-low">Price: Low → High</option>
      <option value="price-high">Price: High → Low</option>
      <option value="discount">Discount: High → Low</option>
      <option value="name-asc">Name: A → Z</option>
      <option value="name-desc">Name: Z → A</option>
      <option value="brand">Brand: A → Z</option>
    </select>
  `;

  container.parentElement.insertBefore(controlsDiv, container);

  const searchInput = controlsDiv.querySelector("#search-input");
  const sortSelect = controlsDiv.querySelector("#sort-select");

  function updateDisplay(){
    let filtered = filterProducts(products, searchInput.value);
    let sorted = sortProducts(filtered, sortSelect.value);

    container.innerHTML = "";
    renderListWithTemplate(productCard, container, sorted);
  }

  searchInput.addEventListener("input", updateDisplay);
  sortSelect.addEventListener("change", updateDisplay);
}

export async function productList(selector, category){
  const el = document.querySelector(selector);
  const products = await getData(category);

  renderListWithTemplate(productCard, el, products);
  createControls(el, products);
}
