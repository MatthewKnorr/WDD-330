import { productList } from './productList.mjs';
import {loadHeaderFooter} from './utils.mjs';
import { displayAlerts } from './alert.mjs';

productList('.product-list', 'tents');

loadHeaderFooter();

displayAlerts();