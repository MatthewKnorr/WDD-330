import { loadHeaderFooter, getParam } from "./utils.mjs";
import { login } from "./auth.mjs";

loadHeaderFooter();

const param = getParam('redirect');

const button = document.getElementById("loginButton");

button.addEventListener("click", (e)=>{

  const username = document.querySelector('#username').value
  const password = document.querySelector('#password').value
  login({username, password }, param);
}
)