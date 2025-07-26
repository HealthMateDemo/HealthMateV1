export function getNotesCount(conversationId?: string): number {
  try {
    // Check saved notes history from localStorage
    const storedHistory = localStorage.getItem("zenhealth-notes-history");
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory);
      if (conversationId) {
        // Filter notes by conversation ID
        return parsed.filter((note: any) => note.conversationId === conversationId).length;
      } else {
        // If no conversationId, only count items without conversationId (global items)
        return parsed.filter((note: any) => !note.conversationId).length;
      }
      return parsed.length;
    }
    return 0;
  } catch (error) {
    console.error("Error getting notes count:", error);
    return 0;
  }
}
