"use client";
import { useState } from "react";
interface MenuLinkProps {
  label: string;
  onClick: () => void;
  icon?: string;
  variant?: "default" | "danger" | "primary";
  disabled?: boolean;
}

const MenuLink: React.FC<MenuLinkProps> = ({
  label,
  onClick,
  icon,
  variant = "default",
  disabled = false
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
      onClick();
    }
  };

  const getVariantStyles = () => {
    if (disabled) {
      return "text-gray-400 cursor-not-allowed opacity-50";
    }

    switch (variant) {
      case "danger":
        return "text-red-600 hover:text-red-800 hover:bg-red-50 border-l-4 border-transparent hover:border-red-300";
      case "primary":
        return "text-purple-600 hover:text-purple-800 hover:bg-purple-50 border-l-4 border-transparent hover:border-purple-300";
      default:
        return "text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300";
    }
  };

  const getIcon = () => {
    if (!icon) return null;

    const iconClass = `w-4 h-4 mr-3 transition-all duration-200 ${
      disabled ? "text-gray-400" :
      variant === "danger" ? "text-red-500 group-hover:text-red-700" :
      variant === "primary" ? "text-purple-500 group-hover:text-purple-700" :
      "text-gray-500 group-hover:text-gray-700"
    } ${isPressed ? "scale-110" : "group-hover:scale-110"}`;

    switch (icon) {
      case "logout":
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V6a3 3 0 0 1 6 0v3m-3 4.5h.008v.008H12v-.008ZM21 10.5h-2.25a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3H21a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3Z" />
          </svg>
        );
      case "help":
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        );
      case "settings":
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex items-center px-4 py-3 transition-all duration-200 cursor-pointer ${
        disabled ? "cursor-not-allowed" : "active:scale-[0.98]"
      } ${getVariantStyles()} ${
        isPressed ? "scale-[0.98] bg-opacity-80" : ""
      }`}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

      {/* Icon */}
      {getIcon()}

      {/* Label */}
      <span className={`text-sm font-medium transition-all duration-200 ${
        isPressed ? "transform translate-x-1" : ""
      }`}>
        {label}
      </span>

      {/* Arrow indicator */}
      {!disabled && variant === "default" && (
        <svg
          className={`ml-auto w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transform transition-all duration-200 ${
            isPressed ? "translate-x-1 scale-110" : "translate-x-1 group-hover:translate-x-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      )}

      {/* Ripple effect */}
      {isPressed && (
        <div className="absolute inset-0 bg-gray-200 rounded-md opacity-30 animate-ping pointer-events-none" />
      )}
    </div>
  );
};

export default MenuLink;
