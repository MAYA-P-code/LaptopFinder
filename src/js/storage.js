const THEME_KEY = "laptopFinderTheme";
const FAVORITES_KEY = "laptopFinderFavorites";
const COMPARE_KEY = "laptopFinderCompare";

export const getTheme = () => {
  try {
    return JSON.parse(localStorage.getItem(THEME_KEY)) === "performance"
      ? "performance" : "battery";
  } catch {
    return "battery";
  }
};

export const saveTheme = theme => {
  localStorage.setItem(THEME_KEY, JSON.stringify(theme));
};

function readIds(key) {
  try {
    const ids = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(ids) ? ids.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

export const getFavorites = () => readIds(FAVORITES_KEY);
export const getCompareIds = () => readIds(COMPARE_KEY);

export function toggleFavorite(id) {
  const ids = getFavorites();
  const updated = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  if (!updated.includes(id)) {
    saveCompareIds(getCompareIds().filter(x => x !== id));
  }
}

export function clearFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
  saveCompareIds([]);
}

export function saveCompareIds(ids) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
}

export function toggleCompare(id) {
  const ids = getCompareIds().filter(x => getFavorites().includes(x));
  if (ids.includes(id)) {
    saveCompareIds(ids.filter(x => x !== id));
    return "removed";
  }
  if (ids.length >= 4) return "limit";
  if (!getFavorites().includes(id)) toggleFavorite(id);
  saveCompareIds([...ids, id]);
  return "added";
}
