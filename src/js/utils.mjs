// utils.mjs

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
