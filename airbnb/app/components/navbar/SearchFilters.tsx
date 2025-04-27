"use client";
import useSearchModal from "@/app/hooks/useSearchModal";
import { memo } from "react";

// Define the props for the FilterButton component
interface FilterButtonProps {
  label: string;
  subLabel: string;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = memo(
  ({ label, subLabel, onClick }) => (
    <div
      onClick={onClick}
      className="cursor-pointer h-[55px] px-8 flex justify-center flex-col rounded-full relative overflow-hidden group"
    >
      <p className="text-xs font-semibold z-10">{label}</p>
      <p className="text-sm z-10 text-gray-500">{subLabel}</p>
      <span className="absolute inset-0 w-full h-full bg-gray-300 transform scale-x-0 transition-all duration-300 group-hover:scale-x-100 origin-left z-0"></span>
    </div>
  )
);

FilterButton.displayName = "FilterButton";

const SearchFilters = () => {
  const searchModal = useSearchModal();

  const handleClick = (filter: string) => {
    searchModal.open(filter);
  };

  return (
    <div
      onClick={() => handleClick("location")}
      className="h-[54px] flex flex-row items-center justify-between border rounded-full"
    >
      <div className="hidden lg:block">
        <div className="flex flex-row items-center justify-between">
          <FilterButton
            label="Where"
            subLabel="Wanted Location"
            onClick={() => handleClick("location")}
          />
          <FilterButton
            label="Check-In"
            subLabel="Add dates"
            onClick={() => handleClick("checkIn")}
          />
          <FilterButton
            label="Check-Out"
            subLabel="Add dates"
            onClick={() => handleClick("checkOut")}
          />
          <FilterButton
            label="Who"
            subLabel="Add guests"
            onClick={() => handleClick("guests")}
          />
        </div>
      </div>
      <div className="p-2">
        <div
          className="cursor-pointer p-2 lg:p-4 bg-purple-600 rounded-full text-white transition duration-300 ease-in-out transform hover:bg-purple-700 hover:scale-105"
          aria-label="Search"
        >
          <svg
            viewBox="0 0 32 32"
            style={{
              display: "block",
              fill: "none",
              height: "16px",
              width: "16px",
              stroke: "currentColor",
              strokeWidth: 4,
              overflow: "visible",
            }}
            aria-hidden="true"
            role="presentation"
            focusable="false"
          >
            <path
              fill="none"
              d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
