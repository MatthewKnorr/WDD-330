import { loadHeaderFooter } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";
import { clearLocalStorage } from "./utils.mjs";

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
  var myForm = document.forms[0];
  var chk_status = myForm.checkValidity();
  myForm.reportValidity();
  if (chk_status) {
    checkoutProcess.calculateOrdertotal();
    checkoutProcess.checkout(e.target);
    window.location.href = '../checkout/success.html';
    clearLocalStorage('so-cart');
  }
});

// listening for click on the button
 //document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
   //e.preventDefault();
    //console.log('Submission Test Complete!');
   //checkoutProcess.checkout(document.forms['checkout']);
 //});
