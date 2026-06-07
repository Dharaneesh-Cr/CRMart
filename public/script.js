const API_URL = "http://localhost:5000/api";
let orderCount = 0;
let allProducts = [];
let token = localStorage.getItem("crmart_token") || "";

function rupees(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function updateLoginStatus(name) {
  const status = document.getElementById("login-status");
  if (status) status.innerText = token ? `Logged in${name ? " as " + name : ""}` : "Not logged in";
}

async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    allProducts = await res.json();
    renderProducts(allProducts);
  } catch (error) {
    alert("Backend is not running. Start server using: npm run dev");
    console.error(error);
  }
}

function renderProducts(products) {
  const laptopContainer = document.getElementById("laptop-products");
  const phoneContainer = document.getElementById("phone-products");
  laptopContainer.innerHTML = "";
  phoneContainer.innerHTML = "";

  products.forEach(product => {
    const column = document.createElement("div");
    column.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
    column.innerHTML = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.category}">
        <p>${product.name}</p>
        <h2>${rupees(product.price)}</h2>
        <button onclick="addToOrders('${product._id}')">Order</button>
      </div>
    `;

    if ((product.category || "").toLowerCase().includes("phone")) {
      phoneContainer.appendChild(column);
    } else {
      laptopContainer.appendChild(column);
    }
  });
}

async function addToOrders(productId) {
  if (!token) {
    alert("Please login before ordering");
    document.getElementById("auth").scrollIntoView({ behavior: "smooth" });
    return;
  }

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity: 1 })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Order failed");

    await loadOrders();
    document.getElementById("orders").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    alert(error.message);
  }
}

async function loadOrders() {
  if (!token) return;

  const res = await fetch(`${API_URL}/orders`, { headers: getHeaders() });
  const orders = await res.json();
  const container = document.getElementById("orders-container");
  container.innerHTML = "";
  orderCount = orders.length;
  document.getElementById("order-count").innerText = orderCount;
  document.getElementById("empty-message").style.display = orderCount ? "none" : "block";

  orders.forEach(order => {
    const product = order.product;
    const column = document.createElement("div");
    column.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
    column.innerHTML = `
      <div class="order-card">
        <img src="${product.image}" alt="Ordered Product">
        <p>${product.name}</p>
        <h2>${rupees(product.price)}</h2>
        <button onclick="removeOrder('${order._id}')">Remove</button>
      </div>
    `;
    container.appendChild(column);
  });
}

async function removeOrder(orderId) {
  await fetch(`${API_URL}/orders/${orderId}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  await loadOrders();
}

function search(event) {
  event.preventDefault();
  const searchValue = document.getElementById("searchbar").value.toLowerCase().trim();
  const filtered = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchValue) ||
    product.category.toLowerCase().includes(searchValue)
  );

  renderProducts(searchValue ? filtered : allProducts);
  document.getElementById("product-page").scrollIntoView({ behavior: "smooth" });

  if (searchValue && filtered.length === 0) alert("No products found");
}

async function registerUser() {
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  alert(data.message);
}

async function loginUser() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Login failed");
    return;
  }

  token = data.token;
  localStorage.setItem("crmart_token", token);
  updateLoginStatus(data.user.name);
  await loadOrders();
  alert("Login successful");
}

window.addEventListener("DOMContentLoaded", async () => {
  updateLoginStatus();
  await loadProducts();
  await loadOrders();
});
