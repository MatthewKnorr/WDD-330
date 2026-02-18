import { renderCartSubscript } from './cartBadge.mjs';
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  const item = localStorage.getItem(key);
  if (!item) return [];
  try {
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    console.error(`Error parsing JSON from localStorage for key "${key}":`, e);
    return [];
  }
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlString = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlString.join(""));
}

export async function renderWithTemplate(templateFn, parentElement, data, callback, position = "afterbegin", clear = true) {
  // get template using function...no need to loop this time.
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlString = await templateFn(data);
  parentElement.insertAdjacentHTML(position, htmlString);
  if (callback) {
    callback(data);
  }
}

export function loadTemplate(path) {
  return async function () {
    const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      return html;
    }
  }
}

export async function loadHeaderFooter() {
  const headerTemplate = loadTemplate("/partials/header.html");
  const footerTemplate = loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("header");
  const footerElement = document.querySelector("footer");

  await renderWithTemplate(headerTemplate, headerElement);
  await renderWithTemplate(footerTemplate, footerElement);
  renderCartSubscript();
}

export function discountPercent(suggestedPrice, finalPrice){
  const discountPrice = suggestedPrice - finalPrice;
  return ((discountPrice/suggestedPrice)* 100).toFixed(0);
}