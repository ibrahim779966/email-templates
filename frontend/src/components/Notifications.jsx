import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeNotification,
  selectNotifications,
} from "../redux/slices/uiSlice";

export default function Notifications() {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => dispatch(removeNotification(notification.id))}
        />
      ))}
    </div>
  );
}

function NotificationItem({ notification, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, notification.duration || 3000);

    return () => clearTimeout(timer);
  }, [notification.duration, onRemove]);

  const styles = {
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    error: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
    info: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
  };

  const icons = {
    success: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    info: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`
        px-6 py-4 rounded-xl shadow-2xl
        transform transition-all duration-300
        animate-slide-in-right
        ${styles[notification.type] || styles.info}
      `}
    >
      <div className="flex items-center gap-3">
        {icons[notification.type] || icons.info}
        <span className="font-medium">{notification.message}</span>
        <button
          onClick={onRemove}
          className="ml-4 hover:scale-110 transition-transform"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
