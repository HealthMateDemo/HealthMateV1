export function getImagesCount(conversationId?: string): number {
  try {
    // Check saved images history from localStorage
    const storedHistory = localStorage.getItem("zenhealth-images-history");
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory);
      if (conversationId) {
        // Filter images by conversation ID
        return parsed.filter((image: any) => image.conversationId === conversationId).length;
      } else {
        // If no conversationId, only count items without conversationId (global items)
        return parsed.filter((image: any) => !image.conversationId).length;
      }
      return parsed.length;
    }
    return 0;
  } catch (error) {
    console.error("Error getting images count:", error);
    return 0;
  }
}
