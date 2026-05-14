const API_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

function saveToken(token) {
  localStorage.setItem("token", token);
}

function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

async function login(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  const data = await res.json();

  if (data.token) {
    saveToken(data.token);

    saveUser({
      username: data.username,
      is_admin: data.is_admin
    });
  }

  return data;
}

async function register(username, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  const data = await res.json();

  if (data.token) {
    saveToken(data.token);

    saveUser({
      username: data.username,
      is_admin: data.is_admin
    });
  }

  return data;
}

async function apiGetProducts() {
  const res = await fetch(`${API_URL}/products`);
  return await res.json();
}

async function apiAddToCart(product_id, quantity = 1) {
  const res = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken()
    },
    body: JSON.stringify({
      product_id,
      quantity
    })
  });

  return await res.json();
}

async function apiGetCart() {
  const res = await fetch(`${API_URL}/cart`, {
    headers: {
      Authorization: getToken()
    }
  });

  return await res.json();
}

async function apiUpdateCart(product_id, quantity) {
  const res = await fetch(`${API_URL}/cart/${product_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken()
    },
    body: JSON.stringify({
      quantity
    })
  });

  return await res.json();
}