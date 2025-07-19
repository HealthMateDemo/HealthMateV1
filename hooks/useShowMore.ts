import { useState } from "react";

function useShowMore<T>(items: T[], initialCount: number = 3) {
  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll ? items : items.slice(0, initialCount);
  const showMore = () => setShowAll(true);
  const showLess = () => setShowAll(false);
  return {
    displayedItems,
    showAll,
    showMore,
    showLess,
    total: items.length,
    hasMore: items.length > initialCount,
  };
}

export default useShowMore;
