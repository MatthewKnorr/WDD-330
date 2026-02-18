const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export async function getData(category) {
  if (!category) {
    throw new Error("No category provided to getData()");
  }

  const url = `${baseURL.replace(/\/$/, "")}/products/search/${category}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const data = await response.json();
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
