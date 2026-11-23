import { getTheme, saveTheme, getFavorites, toggleFavorite } from "./storage.js";

const pages = [
  ["Home", "index.html"],
  ["Laptops", "laptops.html"],
  ["Details", "details.html"],
  ["Favorites", "favorites.html"],
  ["Compare", "compare.html"]
];

export function renderLayout() {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  const links = pages.map(([name, url]) => `
    <a class="rounded px-2 py-1 hover:underline focus-visible:outline-2" href="${url}">${name}</a>
  `).join("");

  header.innerHTML = `
    <div class="mx-auto max-w-6xl px-4 py-4">
      <div class="flex items-center justify-between gap-2">
        <a class="text-base font-bold sm:text-lg" href="index.html">Student Laptop Finder</a>
        <div class="flex shrink-0 gap-2">
          <button id="theme-toggle" class="btn-action text-xs sm:text-sm" type="button"></button>
          <button id="menu-toggle" class="btn-action text-xs md:hidden" type="button"
                  aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav">Menu</button>
        </div>
      </div>
      <nav id="site-nav" aria-label="Main navigation" class="mt-4 hidden flex-col gap-3 md:flex md:flex-row">
        ${links}
      </nav>
    </div>`;
  footer.innerHTML = `<div class="mx-auto max-w-6xl px-4 py-4 text-sm">Student Laptop Finder</div>`;

  const themeButton = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeButton.textContent = theme === "battery" ? "Battery Saver" : "Performance";
  }

  // Restore the theme saved on another page.
  applyTheme(getTheme());
  themeButton.addEventListener("click", () => {
    const next = getTheme() === "battery" ? "performance" : "battery";
    saveTheme(next);
    applyTheme(next);
  });
  menuButton.addEventListener("click", () => {
    const opened = nav.classList.toggle("hidden") === false;
    menuButton.setAttribute("aria-expanded", String(opened));
  });
}

export function renderLaptopCard(laptop) {
  const saved = getFavorites().includes(laptop.id);
  return `
    <article class="laptop-card">
      <img src="${laptop.image}" alt="Illustration of ${laptop.name}"
           class="h-40 w-full rounded-md object-contain">
      <h2 class="mt-3 text-lg font-semibold">${laptop.name}</h2>
      <p>${laptop.brand}</p>
      <p class="mt-2 font-bold">$${laptop.price}</p>
      <p class="mt-2 text-sm">CPU: ${laptop.cpu}</p>
      <p class="text-sm">RAM: ${laptop.ramGB} GB</p>
      <p class="text-sm">Storage: ${laptop.storageGB} GB</p>
      <p class="text-sm">Battery: ${laptop.batteryHours} hours</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <a href="details.html?id=${laptop.id}" class="btn-action inline-block">View Details</a>
        <button class="btn-action" type="button" data-favorite-id="${laptop.id}"
                aria-pressed="${saved}">${saved ? "Remove Favorite" : "Add to Favorites"}</button>
      </div>
    </article>`;
}

export function setupFavoriteButtons(container, onChange) {
  container.addEventListener("click", event => {
    const button = event.target.closest("[data-favorite-id]");
    if (!button || !container.contains(button)) return;
    toggleFavorite(Number(button.dataset.favoriteId));
    onChange();
  });
}

export function loadingCards() {
  return Array.from({ length: 3 }, () => `
    <div class="laptop-card animate-pulse" aria-hidden="true">
      <div class="h-40 rounded bg-gray-300"></div>
      <div class="mt-4 h-5 w-3/4 rounded bg-gray-300"></div>
      <div class="mt-3 h-4 w-1/2 rounded bg-gray-300"></div>
      <div class="mt-4 h-20 rounded bg-gray-300"></div>
    </div>`).join("");
}

renderLayout();
