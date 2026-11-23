export async function getLaptops() {
  try {
    const response = await fetch("./data/laptops.json");
    if (!response.ok) throw new Error("Request failed");
    return await response.json();
  } catch {
    throw new Error("Could not load laptops.");
  }
}
