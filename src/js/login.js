import { loadHeaderFooter, getParam } from "./utils.mjs";
import { login } from "./auth.mjs";

loadHeaderFooter();

const redirect = getParam("redirect") || "/";

const button = document.getElementById("loginButton");

button.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  login({ email, password }, redirect);
});