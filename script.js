const cars = [
  {id:1,brand:"Porsche",model:"911 Carrera",year:2024,type:"Coupe",price:48500000,priceLabel:"PKR 4.85 crore",power:"388 hp",engine:"3.0L Twin-Turbo",drive:"RWD",tag:"ICONIC",image:"https://commons.wikimedia.org/wiki/Special:FilePath/2024_Porsche_911_992_Carrera.jpg?width=1200",description:"A timeless sports car with precise handling, sculpted design and an unmistakable driving character."},
  {id:2,brand:"Mercedes-Benz",model:"G-Class",year:2024,type:"SUV",price:67500000,priceLabel:"PKR 6.75 crore",power:"416 hp",engine:"4.0L V8",drive:"AWD",tag:"SIGNATURE SUV",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_G_Class_W463.jpg?width=1200",description:"A bold luxury SUV that combines commanding presence with a beautifully appointed cabin."},
  {id:3,brand:"BMW",model:"M4 Competition",year:2024,type:"Coupe",price:32500000,priceLabel:"PKR 3.25 crore",power:"503 hp",engine:"3.0L Twin-Turbo",drive:"RWD",tag:"PERFORMANCE",image:"https://commons.wikimedia.org/wiki/Special:FilePath/BMW_M4_(G82)_Competition_1X7A0305.jpg?width=1200",description:"Motorsport-inspired performance meets everyday refinement in this athletic coupe."},
  {id:4,brand:"Range Rover",model:"Sport Autobiography",year:2024,type:"SUV",price:59000000,priceLabel:"PKR 5.90 crore",power:"523 hp",engine:"4.4L V8",drive:"AWD",tag:"REFINED",image:"https://commons.wikimedia.org/wiki/Special:FilePath/2023_Range_Rover_Sport.jpg?width=1200",description:"A sophisticated performance SUV designed around comfort, capability and modern luxury."},
  {id:5,brand:"Audi",model:"RS e-tron GT",year:2024,type:"Sedan",price:42000000,priceLabel:"PKR 4.20 crore",power:"637 hp",engine:"Electric",drive:"AWD",tag:"ELECTRIC",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Audi_RS_e-tron_GT.jpg?width=1200",description:"Progressive design and instant electric performance create a distinctly modern grand tourer."},
  {id:6,brand:"Lexus",model:"LC 500 Convertible",year:2023,type:"Convertible",price:39500000,priceLabel:"PKR 3.95 crore",power:"471 hp",engine:"5.0L V8",drive:"RWD",tag:"OPEN-AIR",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Lexus_LC500_Convertible.jpg?width=1200",description:"An expressive grand tourer with a naturally aspirated V8 and open-air character."}
];

const carGrid = document.getElementById("carGrid");
const searchInput = document.getElementById("searchInput");
const brandFilter = document.getElementById("brandFilter");
const typeFilter = document.getElementById("typeFilter");
const priceFilter = document.getElementById("priceFilter");
const resultsCount = document.getElementById("resultsCount");
const interestCar = document.getElementById("interestCar");
const modal = document.getElementById("carModal");
const toast = document.getElementById("toast");
const whatsappNumber = "923001234567"; // Replace with your own WhatsApp number, country code included, no + or spaces.

function formatPrice(price) {
  if (price >= 10000000) return `PKR ${(price / 10000000).toFixed(2)} crore`;
  return `PKR ${price.toLocaleString("en-PK")}`;
}

function populateFilters() {
  [...new Set(cars.map(car => car.brand))].sort().forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandFilter.appendChild(option);
  });
  cars.forEach(car => {
    const option = document.createElement("option");
    option.value = `${car.brand} ${car.model}`;
    option.textContent = `${car.brand} ${car.model}`;
    interestCar.appendChild(option);
  });
}

function renderCars() {
  const query = searchInput.value.trim().toLowerCase();
  const brand = brandFilter.value;
  const type = typeFilter.value;
  const maxPrice = priceFilter.value === "all" ? Infinity : Number(priceFilter.value);

  const filtered = cars.filter(car => {
    const matchesSearch = `${car.brand} ${car.model} ${car.year}`.toLowerCase().includes(query);
    return matchesSearch && (brand === "all" || car.brand === brand) &&
      (type === "all" || car.type === type) && car.price <= maxPrice;
  });

  resultsCount.textContent = `Showing ${filtered.length} of ${cars.length} vehicles`;
  if (!filtered.length) {
    carGrid.innerHTML = '<div class="empty-state"><h3>No vehicles found</h3><p>Try changing your search or filters.</p></div>';
    return;
  }

  carGrid.innerHTML = filtered.map((car, index) => `
    <article class="car-card" style="animation-delay:${index * 70}ms">
      <div class="car-image-wrap">
        <img src="${car.image}" alt="${car.year} ${car.brand} ${car.model}" loading="lazy">
        <span class="car-tag">${car.tag}</span>
      </div>
      <div class="car-card-body">
        <div class="car-meta"><span>${car.year} · ${car.type}</span><span>${car.drive}</span></div>
        <h3>${car.brand} ${car.model}</h3>
        <div class="spec-list"><span>◈ ${car.power}</span><span>⚙ ${car.engine}</span></div>
        <div class="card-bottom"><span class="car-price">${formatPrice(car.price)}</span><button class="details-btn" data-car-id="${car.id}" type="button">View details ↗</button></div>
      </div>
    </article>`).join("");
}

function buildWhatsAppLink(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function openCarDetails(id) {
  const car = cars.find(item => item.id === Number(id));
  if (!car) return;
  document.getElementById("modalImage").src = car.image;
  document.getElementById("modalImage").alt = `${car.brand} ${car.model}`;
  document.getElementById("modalTitle").textContent = `${car.brand} ${car.model}`;
  document.getElementById("modalDescription").textContent = car.description;
  document.getElementById("modalSpecs").innerHTML = `
    <span>Year: <b>${car.year}</b></span><span>Body: <b>${car.type}</b></span>
    <span>Power: <b>${car.power}</b></span><span>Engine: <b>${car.engine}</b></span>
    <span>Drivetrain: <b>${car.drive}</b></span><span>Collection: <b>${car.tag}</b></span>`;
  document.getElementById("modalPrice").textContent = formatPrice(car.price);
  document.getElementById("modalWhatsApp").href = buildWhatsAppLink(`Hello AutoLux, I'm interested in the ${car.year} ${car.brand} ${car.model}. Please share more details.`);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

document.getElementById("menuToggle").addEventListener("click", () => {
  const nav = document.getElementById("mainNav");
  const isOpen = nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll("#mainNav a").forEach(link => link.addEventListener("click", () => {
  document.getElementById("mainNav").classList.remove("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
}));
[searchInput, brandFilter, typeFilter, priceFilter].forEach(control => {
  control.addEventListener(control === searchInput ? "input" : "change", renderCars);
});
document.getElementById("resetFilters").addEventListener("click", () => {
  searchInput.value = "";
  brandFilter.value = "all";
  typeFilter.value = "all";
  priceFilter.value = "all";
  renderCars();
});
carGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-car-id]");
  if (button) openCarDetails(button.dataset.carId);
});
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });

document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const vehicle = interestCar.value;
  const message = document.getElementById("customerMessage").value.trim();
  if (name.length < 2 || !email || !message) {
    showToast("Please complete all required fields.");
    return;
  }
  const enquiry = `Hello AutoLux, my name is ${name}. Email: ${email}. Vehicle of interest: ${vehicle}. Message: ${message}`;
  window.open(buildWhatsAppLink(enquiry), "_blank", "noopener,noreferrer");
  showToast("Your enquiry message is ready in WhatsApp.");
});
document.getElementById("whatsappFloat").href = buildWhatsAppLink("Hello AutoLux, I'd like to enquire about your car collection.");

populateFilters();
renderCars();
