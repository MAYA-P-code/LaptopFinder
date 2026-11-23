import { getLaptops } from "./api.js";
import { renderLaptopCard, setupFavoriteButtons, loadingCards } from "./ui.js";

const list = document.getElementById("laptop-list");
const status = document.getElementById("catalogue-status");
const count = document.getElementById("result-count");
const search = document.getElementById("search");
const category = document.getElementById("category");
const maxPrice = document.getElementById("max-price");
const minRam = document.getElementById("min-ram");
const sortBy = document.getElementById("sort");
let allLaptops = [];

function updateCatalogue() {
  const text = search.value.toLowerCase().trim();
  let results = allLaptops.filter(item =>
    (item.name.toLowerCase().includes(text) || item.brand.toLowerCase().includes(text)) &&
    (!category.value || item.category === category.value) &&
    (!maxPrice.value || item.price <= Number(maxPrice.value)) &&
    (!minRam.value || item.ramGB >= Number(minRam.value))
  );
  const [field, direction] = sortBy.value.split("-");
  const fields = { price: "price", battery: "batteryHours", weight: "weightKg" };
  if (fields[field]) {
    results = [...results].sort((a, b) => direction === "asc"
      ? a[fields[field]] - b[fields[field]]
      : b[fields[field]] - a[fields[field]]);
  }
  list.innerHTML = results.map(renderLaptopCard).join("");
  count.textContent = `${results.length} laptops found`;
  status.textContent = results.length ? "" : "No laptops match your search or filters.";
}

async function loadCatalogue() {
  list.innerHTML = loadingCards();
  try {
    allLaptops = await getLaptops();
    updateCatalogue();
  } catch (error) {
    list.innerHTML = "";
    count.textContent = "0 laptops found";
    status.textContent = error.message;
  }
}

search.addEventListener("input", updateCatalogue);
category.addEventListener("change", updateCatalogue);
maxPrice.addEventListener("input", updateCatalogue);
minRam.addEventListener("input", updateCatalogue);
sortBy.addEventListener("change", updateCatalogue);
setupFavoriteButtons(list, updateCatalogue);
loadCatalogue();
