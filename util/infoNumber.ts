export function getInfoCount(conversationId?: string): number {
  try {
    let totalCount = 0;

    // Check saved URLs history from localStorage
    const storedUrls = localStorage.getItem("zenhealth-urls-history");
    if (storedUrls) {
      const parsed = JSON.parse(storedUrls);
      if (conversationId) {
        // Filter URLs by conversation ID
        totalCount += parsed.filter((url: any) => url.conversationId === conversationId).length;
      } else {
        // If no conversationId, only count items without conversationId (global items)
        totalCount += parsed.filter((url: any) => !url.conversationId).length;
      }
    }

    // Check saved emails history from localStorage
    const storedEmails = localStorage.getItem("zenhealth-emails-history");
    if (storedEmails) {
      const parsed = JSON.parse(storedEmails);
      if (conversationId) {
        // Filter emails by conversation ID
        totalCount += parsed.filter((email: any) => email.conversationId === conversationId).length;
      } else {
        // If no conversationId, only count items without conversationId (global items)
        totalCount += parsed.filter((email: any) => !email.conversationId).length;
      }
    }

    return totalCount;
  } catch (error) {
    console.error("Error getting info count:", error);
    return 0;
  }
}
