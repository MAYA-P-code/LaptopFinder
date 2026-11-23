import { getLaptops } from "./api.js";
import { getFavorites } from "./storage.js";

async function loadHome() {
  const status = document.getElementById("home-status");
  status.textContent = "Loading...";
  try {
    const laptops = await getLaptops();
    const lowest = laptops.reduce((min, item) => Math.min(min, item.price), Infinity);
    document.getElementById("total-laptops").textContent = laptops.length;
    document.getElementById("lowest-price").textContent = laptops.length ? `$${lowest}` : "--";
    document.getElementById("favorites-count").textContent = getFavorites().length;
    status.textContent = "";
  } catch (error) {
    status.textContent = error.message;
  }
}
loadHome();
