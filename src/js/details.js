import { getLaptops } from "./api.js";
import { getFavorites, getCompareIds, toggleFavorite, toggleCompare } from "./storage.js";

const box = document.getElementById("laptop-details");
const status = document.getElementById("details-status");
const id = Number(new URLSearchParams(location.search).get("id"));
let laptop;

const fields = [
  ["ID", "id"], ["Name", "name"], ["Brand", "brand"],
  ["Price", "price", "$"], ["Category", "category"], ["CPU", "cpu"],
  ["RAM", "ramGB", " GB"], ["Storage", "storageGB", " GB"],
  ["Battery", "batteryHours", " hours"], ["Weight", "weightKg", " kg"],
  ["Screen", "screenInches", " inches"]
];

function showDetails() {
  const saved = getFavorites().includes(laptop.id);
  const selected = getCompareIds().includes(laptop.id);
  const rows = fields.map(([label, key, unit = ""]) => `
    <tr class="border-b border-[var(--border-color)]">
      <th scope="row" class="p-2 text-left">${label}</th>
      <td class="p-2">${unit === "$" ? "$" : ""}${laptop[key]}${unit === "$" ? "" : unit}</td>
    </tr>`).join("");
  box.innerHTML = `
    <div class="laptop-card">
      <img src="${laptop.image}" alt="Illustration of ${laptop.name}"
           class="h-52 w-full object-contain">
      <h2 class="mt-4 text-xl font-semibold">${laptop.name}</h2>
      <p class="mt-2">${laptop.description}</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <button id="detail-favorite" class="btn-action" type="button"
                aria-pressed="${saved}">${saved ? "Remove Favorite" : "Add to Favorites"}</button>
        <button id="detail-compare" class="btn-action" type="button"
                aria-pressed="${selected}">${selected ? "Remove from Compare" : "Add to Compare"}</button>
      </div>
      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-sm"><tbody>${rows}</tbody></table>
      </div>
    </div>`;
  document.getElementById("detail-favorite").addEventListener("click", () => {
    toggleFavorite(laptop.id);
    status.textContent = "";
    showDetails();
  });
  document.getElementById("detail-compare").addEventListener("click", () => {
    const result = toggleCompare(laptop.id);
    status.textContent = result === "limit" ? "You can compare up to 4 laptops." : "";
    showDetails();
  });
}

async function loadDetails() {
  if (!Number.isInteger(id) || id <= 0) {
    status.textContent = "Missing or invalid laptop ID.";
    return;
  }
  status.textContent = "Loading...";
  try {
    const laptops = await getLaptops();
    laptop = laptops.find(item => item.id === id);
    if (!laptop) {
      status.textContent = "Laptop not found.";
      return;
    }
    status.textContent = "";
    showDetails();
  } catch (error) {
    status.textContent = error.message;
  }
}
loadDetails();
