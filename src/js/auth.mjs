import { loginRequest } from "./externalServices.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { jwtDecode } from "jwt-decode";

const tokenKey = "so-token";

export async function login(creds, redirect = "/") {
  try {
    const token = await loginRequest(creds);
    setLocalStorage(tokenKey, token);

    window.location = redirect || "/";
  } catch (err) {
    alert("Invalid email or password");
  }
}

function istokenValid(token) {
  if (!token) {
    return false;
  }

  const decoded = jwtDecode(token);
  const now = Date.now();

  if (decoded.exp * 1000 < now) {
    console.log("Token expired");
    return false;
  }

  return true;
}

export function checkLogin() {
  const token = getLocalStorage(tokenKey);

  const valid = istokenValid(token);

  if (!valid) {
    localStorage.removeItem(tokenKey);

    const location = window.location.pathname;

    window.location = `/login/index.html?redirect=${location}`;
  }

  return token;
}