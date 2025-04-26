"use client";

import React, { useEffect } from "react";
import { create } from "zustand";

interface NotificationStore {
  message: string | null;
  type: "success" | "error" | "info";
  isVisible: boolean;
  showNotification: (
    message: string,
    type: "success" | "error" | "info"
  ) => void;
  hideNotification: () => void;
}

export const useNotification = create<NotificationStore>((set) => ({
  message: null,
  type: "info",
  isVisible: false,
  showNotification: (message, type) => {
    set({ message, type, isVisible: true });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      set({ isVisible: false });
    }, 5000);
  },
  hideNotification: () => set({ isVisible: false }),
}));

const Notification = () => {
  const { message, type, isVisible, hideNotification } = useNotification();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, hideNotification]);

  if (!isVisible || !message) return null;

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg max-w-md`}
      >
        <div className="flex items-center justify-between">
          <p className="mr-8">{message}</p>
          <button
            onClick={hideNotification}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
