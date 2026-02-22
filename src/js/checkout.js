import { loadHeaderFooter } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";

loadHeaderFooter();

checkoutProcess.init("so-cart", ".checkout-summary");

document
  .querySelector("#zip")
  .addEventListener(
    "blur",
    checkoutProcess.calculateOrdertotal.bind(checkoutProcess)
  );

// this is how it would look if we listen for the submit on the form
const form = document.querySelector("#checkoutForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkoutProcess.calculateOrdertotal();
  checkoutProcess.checkout(e.target);
});

// listening for click on the button
 //document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
   //e.preventDefault();
    //console.log('Submission Test Complete!');
   //checkoutProcess.checkout(document.forms['checkout']);
 //});
