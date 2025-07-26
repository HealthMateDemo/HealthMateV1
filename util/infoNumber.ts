export function getInfoCount(): number {
  try {
    let totalCount = 0;

    // Check saved URLs history from localStorage
    const storedUrls = localStorage.getItem("zenhealth-urls-history");
    if (storedUrls) {
      const parsed = JSON.parse(storedUrls);
      totalCount += parsed.length;
    }

    // Check saved emails history from localStorage
    const storedEmails = localStorage.getItem("zenhealth-emails-history");
    if (storedEmails) {
      const parsed = JSON.parse(storedEmails);
      totalCount += parsed.length;
    }

    return totalCount;
  } catch (error) {
    console.error("Error getting info count:", error);
    return 0;
  }
}
