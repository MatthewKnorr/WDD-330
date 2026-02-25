const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export async function getProductsByCategory(category) {
  const response = await fetch(baseURL + `/products/search/${category}`);
  const data = await convertToJson(response);
  return data.Result;
}

export async function getJson(json) {
  return fetch(`../json/${json}.json`)
    .then(convertToJson)
    .then((data) => data);
}

export async function findProductById(id) {
  const response = await fetch(baseURL + `/product/${id}`);
  const product = await convertToJson(response);
  return product.Result;
  
}

export async function checkout(payload) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  const response = await fetch(`${baseURL}/checkout`, options);
  return convertToJson(response);
}