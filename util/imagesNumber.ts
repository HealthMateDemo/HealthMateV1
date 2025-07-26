export function getImagesCount(): number {
  try {
    // Check saved images history from localStorage
    const storedHistory = localStorage.getItem("zenhealth-images-history");
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory);
      return parsed.length;
    }
    return 0;
  } catch (error) {
    console.error("Error getting images count:", error);
    return 0;
  }
}
