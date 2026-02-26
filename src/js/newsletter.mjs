export function initNewsLetter(){
  const form = document.querySelector(".newsletter-form");

  if(!form){return;} // Checks if form exists or not, if not, cancel.

  form.addEventListener("submit", (e) =>{
  e.preventDefault();
  alert("Thank you for subscribing to our newsletter!");
  const userEmail = e.target.querySelector("#newsletter-email").value;
  console.log(`Email for Newsletter: ${userEmail}`);
  form.reset();
  });
}