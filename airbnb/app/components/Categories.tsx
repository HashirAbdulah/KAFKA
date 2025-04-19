"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import useSearchModal, { SearchQuery } from "../hooks/useSearchModal";

const Categories = () => {
  const searchModal = useSearchModal();
  const [category, setCategory] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

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
    { label: "All", value: "", icon: "svg" },
    { label: "Rooms", value: "Room", icon: "/rooms.jpg" },
    { label: "Top Cities", value: "Top_Cities", icon: "/top_cities.jpg" },
    { label: "Cabins", value: "Cabins", icon: "/cabins.jpg" },
    { label: "Mansions", value: "Mansions", icon: "/mansions.jpg" },
    { label: "Trending", value: "Trending", icon: "/trending.jpg" },
    { label: "Amazing Pools", value: "Amazing_pools", icon: "/amazing_pools.jpeg" },
    { label: "Farms House", value: "Farms_House", icon: "/farms_house.jpg" },
  ];

  const scrollContainer = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth;
      if (direction === 'left') {
        containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0; // Reset scroll position on mount
    }
  }, []);

  return (
    <div className="relative flex items-center justify-between px-4">
      <button
        onClick={() => scrollContainer('left')}
        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-gray-700"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <div
        ref={containerRef}
        className="flex space-x-6 overflow-hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categoryItems.map((item) => (
          <div
            key={item.value || "all"}
            onClick={() => _setCategory(item.value)}
            className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
              category === item.value
                ? "border-gray-800 opacity-100"
                : "border-transparent opacity-60"
            } hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out cursor-pointer`}
          >
            {item.icon === "svg" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
                />
              </svg>
            ) : (
              <Image
                src={item.icon}
                alt={`${item.label} logo`}
                width={24}
                height={24}
                className="rounded-full"
                priority
              />
            )}
            <span className="text-xs text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => scrollContainer('right')}
        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-gray-700"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
};

export default Categories;
