"use client";
import React from "react";
import apiService from "../services/apiService";

interface FavouriteButtonProps {
  id: string;
  is_favourite: boolean;
  markFavourite: (is_favourite: boolean) => void;
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({
  id,
  is_favourite,
  markFavourite,
}) => {
  const toogleFavourite = async (e: React.MouseEvent<HTMLDivElement>) => {
    // e.preventDefault();
    e.stopPropagation();
    try {
      console.log("Toggling favorite for property:", id);
      const response = await apiService.post(`/api/properties/${id}/toggle_favourite/`, {});
      console.log("Response:", response);
      markFavourite(response.is_favourite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
    return (
      <div
        onClick={toogleFavourite}
        className="cursor-pointer p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={is_favourite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
          className={`w-6 h-6 ${is_favourite ? "text-airbnb" : "text-gray-600"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </div>
    );
};

export default FavouriteButton;
