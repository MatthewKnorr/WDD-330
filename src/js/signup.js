import { createUser } from "./auth.mjs";

const form = document.querySelector("#signupForm");
const message = document.querySelector("#signupMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const user = {
    name: formData.get("name"),
    address: formData.get("address"),
    email: formData.get("email")
  };

  try {
    await createUser(user);

    message.textContent = "Account created successfully! You can now log in.";
    form.reset();

  } catch (err) {
    console.error(err);
    message.textContent = "There was an error creating your account.";
  }
});