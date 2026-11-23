import { getLaptops } from "./api.js";
import { getFavorites, clearFavorites } from "./storage.js";
import { renderLaptopCard, setupFavoriteButtons, loadingCards } from "./ui.js";

const list = document.getElementById("favorites-list");
const status = document.getElementById("favorites-status");
const clearButton = document.getElementById("clear-favorites");
let allLaptops = [];

function updateFavorites() {
  const ids = getFavorites();
  const laptops = allLaptops.filter(item => ids.includes(item.id));
  const total = laptops.reduce((sum, item) => sum + item.price, 0);
  const average = laptops.length ? total / laptops.length : 0;
  document.getElementById("saved-count").textContent = laptops.length;
  document.getElementById("total-price").textContent = `$${total.toFixed(2)}`;
  document.getElementById("average-price").textContent = `$${average.toFixed(2)}`;
  list.innerHTML = laptops.map(renderLaptopCard).join("");
  status.textContent = laptops.length ? "" : "No favorites saved yet.";
  clearButton.disabled = laptops.length === 0;
}

async function loadFavorites() {
  list.innerHTML = loadingCards();
  status.textContent = "";
  try {
    allLaptops = await getLaptops();
    updateFavorites();
  } catch (error) {
    list.innerHTML = "";
    status.textContent = error.message;
  }
}

setupFavoriteButtons(list, updateFavorites);
clearButton.addEventListener("click", () => {
  clearFavorites();
  updateFavorites();
});
loadFavorites();
