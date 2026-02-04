import { renderCartSubscript } from './cartBadge.mjs';
import { productList } from './productList.mjs';
import {loadHeaderFooter} from './utils.mjs';

// Cart Subscript Rendering
document.addEventListener('DOMContentLoaded', () => {
  renderCartSubscript();
});

productList('.product-list', 'tents');

loadHeaderFooter();