import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../redux/slices/uiSlice";

/**
 * Custom hook for displaying notifications
 * Provides helper functions for different notification types
 */
export const useNotification = () => {
  const dispatch = useDispatch();

  const showSuccess = useCallback(
    (message, duration = 3000) => {
      dispatch(addNotification({ type: "success", message, duration }));
    },
    [dispatch]
  );

  const showError = useCallback(
    (message, duration = 5000) => {
      dispatch(addNotification({ type: "error", message, duration }));
    },
    [dispatch]
  );

  const showWarning = useCallback(
    (message, duration = 4000) => {
      dispatch(addNotification({ type: "warning", message, duration }));
    },
    [dispatch]
  );

  const showInfo = useCallback(
    (message, duration = 3000) => {
      dispatch(addNotification({ type: "info", message, duration }));
    },
    [dispatch]
  );

  return { showSuccess, showError, showWarning, showInfo };
};

export default useNotification;
