const products = [
  {id:1,name:"The Everyday Blazer",category:"Clothing",price:128,badge:"Bestseller",image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=85"},
  {id:2,name:"Structured Shoulder Bag",category:"Accessories",price:94,badge:"New",image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85"},
  {id:3,name:"Relaxed Cotton Shirt",category:"Clothing",price:68,badge:"Essential",image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85"},
  {id:4,name:"Minimal Leather Sneaker",category:"Footwear",price:110,badge:"",image:"https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=85"},
  {id:5,name:"Soft Knit Sweater",category:"Clothing",price:86,badge:"New",image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85"},
  {id:6,name:"Everyday Sunglasses",category:"Accessories",price:54,badge:"",image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=85"},
  {id:7,name:"Modern Crossbody",category:"Accessories",price:78,badge:"Popular",image:"https://images.unsplash.com/photo-1590874692452-4e36a9e6f9d1?auto=format&fit=crop&w=800&q=85"},
  {id:8,name:"Classic Low-Top",category:"Footwear",price:98,badge:"",image:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=85"}
];

const productGrid = document.getElementById("productGrid");
const filters = document.getElementById("filters");
const sortSelect = document.getElementById("sortSelect");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");
let selectedCategory = "All";
let cart = [];
let toastTimer;

function money(value) { return "$" + value.toFixed(0); }
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function renderProducts() {
  let shown = products.filter(p => selectedCategory === "All" || p.category === selectedCategory);
  if (sortSelect.value === "low") shown.sort((a,b) => a.price - b.price);
  if (sortSelect.value === "high") shown.sort((a,b) => b.price - a.price);
  productGrid.innerHTML = shown.map(p => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <button class="add-button" data-add="${p.id}">Add to bag — ${money(p.price)} <span aria-hidden="true">＋</span></button>
      </div>
      <div class="product-meta"><span class="product-name">${p.name}</span><span class="product-price">${money(p.price)}</span></div>
      <div class="product-category">${p.category}</div>
    </article>`).join("");
}
function renderCart() {
  const count = cart.reduce((sum,item) => sum + item.qty, 0);
  const total = cart.reduce((sum,item) => sum + item.price * item.qty, 0);
  cartCount.textContent = count;
  cartTotal.textContent = money(total);
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is looking a little empty.</p>';
    return;
  }
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="">
      <div><strong>${item.name}</strong><small>${money(item.price)} · Qty ${item.qty}</small></div>
      <button class="remove-item" data-remove="${item.id}" aria-label="Remove ${item.name}">Remove</button>
    </div>`).join("");
}
function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
  cartDrawer.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}
filters.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  filters.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
  renderProducts();
});
sortSelect.addEventListener("change", renderProducts);
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const product = products.find(p => p.id === Number(button.dataset.add));
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({...product, qty:1});
  renderCart();
  showToast(`${product.name} added to your bag`);
});
document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("continueShopping").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  cart = cart.filter(item => item.id !== Number(button.dataset.remove));
  renderCart();
});
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.length) { showToast("Add a piece to your bag first."); return; }
  showToast("Demo checkout — connect a payment provider to accept orders.");
});
document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("emailInput").value.trim();
  if (!email) return;
  document.getElementById("newsletterMessage").textContent = "Thanks for joining the Luxe Letter!";
  event.target.reset();
});
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuToggle.textContent = open ? "×" : "☰";
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded","false");
  menuToggle.textContent = "☰";
}));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });
renderProducts();
renderCart();
