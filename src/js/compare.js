import { getLaptops } from "./api.js";
import { getFavorites, getCompareIds, saveCompareIds, toggleCompare } from "./storage.js";

const selection = document.getElementById("compare-selection");
const tableBox = document.getElementById("comparison-table");
const status = document.getElementById("compare-status");
let allLaptops = [];

const rows = [
  ["Price", "price", "low", "$", ""],
  ["RAM", "ramGB", "high", "", " GB"],
  ["Storage", "storageGB", "high", "", " GB"],
  ["Battery", "batteryHours", "high", "", " hours"],
  ["Weight", "weightKg", "low", "", " kg"],
  ["Screen", "screenInches", null, "", " inches"],
  ["CPU", "cpu", null, "", ""],
  ["Category", "category", null, "", ""]
];

function updateCompare(message = "") {
  const favorites = allLaptops.filter(item => getFavorites().includes(item.id));
  const selectedIds = getCompareIds().filter(id => favorites.some(item => item.id === id));
  if (selectedIds.length !== getCompareIds().length) saveCompareIds(selectedIds);

  selection.innerHTML = favorites.length ? favorites.map(item => `
    <label class="flex items-center gap-2 py-2">
      <input type="checkbox" class="rounded" value="${item.id}"
             ${selectedIds.includes(item.id) ? "checked" : ""}>
      <span>${item.name}</span>
    </label>`).join("") : "No favorites saved yet. Add laptops to Favorites first.";

  const selected = selectedIds.map(id => allLaptops.find(item => item.id === id)).filter(Boolean);
  status.textContent = message || (selected.length < 2 ? "Select 2 to 4 favorite laptops to compare." : "");
  if (selected.length < 2) {
    tableBox.innerHTML = "";
    return;
  }

  const headings = selected.map(item => `<th scope="col" class="p-3 text-left">${item.name}</th>`).join("");
  const body = rows.map(([label, key, best, before, after]) => {
    // Find the best numeric value for this row.
    const values = selected.map(item => item[key]);
    const winning = best === "low" ? Math.min(...values) : best === "high" ? Math.max(...values) : null;
    const cells = selected.map(item => `
      <td class="p-3 ${best && item[key] === winning ? "best-value font-semibold" : ""}">
        ${before}${item[key]}${after}
      </td>`).join("");
    return `<tr class="border-t border-[var(--border-color)]">
      <th scope="row" class="p-3 text-left">${label}</th>${cells}
    </tr>`;
  }).join("");

  tableBox.innerHTML = `<table class="w-full min-w-[520px] border-collapse text-sm">
    <thead><tr><th class="p-3 text-left">Specification</th>${headings}</tr></thead>
    <tbody>${body}</tbody>
  </table>`;
}

selection.addEventListener("change", event => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  const result = toggleCompare(Number(event.target.value));
  updateCompare(result === "limit" ? "You can compare up to 4 laptops." : "");
});

async function loadCompare() {
  status.textContent = "Loading...";
  try {
    allLaptops = await getLaptops();
    updateCompare();
  } catch (error) {
    selection.innerHTML = "";
    status.textContent = error.message;
  }
}
loadCompare();
