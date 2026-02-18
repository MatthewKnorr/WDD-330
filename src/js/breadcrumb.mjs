export function initBreadcrumb() {
  const crumb = document.querySelector(".breadcrumb");
  if (!crumb) return;

  const params = new URLSearchParams(window.location.search);

  const category = params.get("page");
  if (category) {
    const formatted =
      category.replace(/-/g, " ")
              .replace(/\b\w/g, c => c.toUpperCase());

    const count = document.querySelectorAll(".product-card").length;

    crumb.innerHTML = `
      <span class="crumb-home">Home</span>
      <span class="crumb-divider">›</span>
      <span class="crumb-active">${formatted}</span>
      <span class="crumb-divider">›</span>
      <span class="crumb-count">${count} items</span>
    `;
    return;
  }

  const product = params.get("product");
  if (product) {
    const title = document.querySelector("#productNameWithoutBrand");
    if (title) {
      crumb.innerHTML = `
        <span class="crumb-home">Home</span>
        <span class="crumb-divider">›</span>
        <span class="crumb-active">${title.innerText}</span>
      `;
    }
    return;
  }

  crumb.innerHTML = "";
}
