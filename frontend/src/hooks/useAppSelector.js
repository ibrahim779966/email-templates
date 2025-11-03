import { useSelector } from "react-redux";

/**
 * Typed useSelector hook for Redux
 * Provides type-safe state selection
 */
export const useAppSelector = (selector) => {
  return useSelector(selector);
};

export default useAppSelector;
