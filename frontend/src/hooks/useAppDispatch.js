import { useDispatch } from "react-redux";

/**
 * Typed useDispatch hook for Redux
 * Returns the dispatch function with proper typing
 */
export const useAppDispatch = () => {
  return useDispatch();
};

export default useAppDispatch;
