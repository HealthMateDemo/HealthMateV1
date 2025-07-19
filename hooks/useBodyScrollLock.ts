import { useEffect } from "react";

/**
 * Locks the body scroll (adds 'overflow-hidden' to <body>) when locked=true.
 * Cleans up on unmount or when locked becomes false.
 */
function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (locked) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [locked]);
}

export default useBodyScrollLock;
