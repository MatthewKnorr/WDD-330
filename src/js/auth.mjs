import { loginRequest } from "./externalServices.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { jwtDecode } from "jwt-decode";

const tokenKey = "so-token";

export async function login(creds, redirect = "/") {
    try {
        const token = await loginRequest(creds);
        setLocalStorage(tokenKey, token);
        // because of the default arg provided above...if no redirect is provided send them Home.
        window.location = redirect;
    } catch (err) {
        alert(err.message.message);
    }
}

function istokenValid(token){
  if (!token){
    return false;
  }
  
  const decoded = jwtDecode(token); //?

  const date = new Date();

  if (decoded.exp *1000 < date.getTime()){
    console.log('expired');
    return false;
  }
  return true; // okay, nice

}

function checkLogin(){
  const token = getLocalStorage(tokenKey);

  const isValid = istokenValid(token);

  if(!isValid){
    localStorage.removeItem(tokenKey);
    // D:

    const location = window.location;
    window.location = `/login/index.html?redirect=${location.pathname}`;
    // D:
  }
  return token
}

