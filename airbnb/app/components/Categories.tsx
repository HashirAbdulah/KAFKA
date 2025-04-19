"use client";
import { useState } from "react";
import Image from "next/image";
import useSearchModal, { SearchQuery } from "../hooks/useSearchModal";

const Categories = () => {
  const searchModal = useSearchModal();
  const [category, setCategory] = useState<string>("");

  const _setCategory = (_category: string) => {
    console.log("Setting category:", _category); // Debug log
    setCategory(_category);
    const query: SearchQuery = {
      country: searchModal.query.country,
      checkIn: searchModal.query.checkIn,
      checkOut: searchModal.query.checkOut,
      guests: searchModal.query.guests,
      bedrooms: searchModal.query.bedrooms,
      bathrooms: searchModal.query.bathrooms,
      category: _category,
    };
    searchModal.setQuery(query);
    console.log("Query set to:", query);
  };

  const categoryItems = [
    { label: "All", value: "", icon: "/rooms.jpg" },
    { label: "Rooms", value: "Room", icon: "/rooms.jpg" },
    { label: "Top Cities", value: "Top_Cities", icon: "/top_cities.jpg" },
    { label: "Cabins", value: "Cabins", icon: "/cabins.jpg" },
    { label: "Mansions", value: "Mansions", icon: "/mansions.jpg" },
    { label: "Trending", value: "Trending", icon: "/trending.jpg" },
    { label: "Amazing Pools", value: "Amazing_Pools", icon: "/amazing_pools.jpeg" },
    { label: "Farms House", value: "Farm_House", icon: "/farms_house.jpg" },
  ];

  return (
    <div className="pt-3 pb-6 flex items-center space-x-12 overflow-x-auto">
      {categoryItems.map((item) => (
        <div
          key={item.value}
          onClick={() => _setCategory(item.value)}
          className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
            category === item.value
              ? "border-gray-800 opacity-100"
              : "border-transparent opacity-60"
          } hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out cursor-pointer`}
        >
          <Image
            src={item.icon}
            alt={`${item.label} logo`}
            width={20}
            height={20}
            priority
          />
          <span className="text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Categories;
