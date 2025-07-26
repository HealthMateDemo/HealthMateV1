export function getNotesCount(): number {
  try {
    // Check saved notes history from localStorage
    const storedHistory = localStorage.getItem("zenhealth-notes-history");
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory);
      return parsed.length;
    }
    return 0;
  } catch (error) {
    console.error("Error getting notes count:", error);
    return 0;
  }
}
