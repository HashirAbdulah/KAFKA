// "use client";
// import useSearchModal from "@/app/hooks/useSearchModal";
// import { memo } from "react";

// // Define the props for the FilterButton component
// interface FilterButtonProps {
//   label: string;
//   subLabel: string;
//   onClick: () => void;
// }

// const FilterButton: React.FC<FilterButtonProps> = memo(
//   ({ label, subLabel, onClick }) => (
//     <div
//       onClick={onClick}
//       className="cursor-pointer h-[55px] px-8 flex justify-center flex-col rounded-full relative overflow-hidden group"
//     >
//       <p className="text-xs font-semibold z-10">{label}</p>
//       <p className="text-sm z-10 text-gray-500">{subLabel}</p>
//       <span className="absolute inset-0 w-full h-full bg-gray-300 transform scale-x-0 transition-all duration-300 group-hover:scale-x-100 origin-left z-0"></span>
//     </div>
//   )
// );

// FilterButton.displayName = "FilterButton";

// const SearchFilters = () => {
//   const searchModal = useSearchModal();

//   const handleClick = (filter: string) => {
//     searchModal.open(filter);
//   };

//   return (
//     <div
//       onClick={() => handleClick("location")}
//       className="h-[54px] flex flex-row items-center justify-between border rounded-full"
//     >
//       <div className="hidden lg:block">
//         <div className="flex flex-row items-center justify-between">
//           <FilterButton
//             label="Where"
//             subLabel="Wanted Location"
//             onClick={() => handleClick("location")}
//           />
//           <FilterButton
//             label="Check-In"
//             subLabel="Add dates"
//             onClick={() => handleClick("checkIn")}
//           />
//           <FilterButton
//             label="Check-Out"
//             subLabel="Add dates"
//             onClick={() => handleClick("checkOut")}
//           />
//           <FilterButton
//             label="Who"
//             subLabel="Add guests"
//             onClick={() => handleClick("guests")}
//           />
//         </div>
//       </div>
//       <div className="p-2">
//         <div
//           className="cursor-pointer p-2 lg:p-4 bg-purple-600 rounded-full text-white transition duration-300 ease-in-out transform hover:bg-purple-700 hover:scale-105"
//           aria-label="Search"
//         >
//           <svg
//             viewBox="0 0 32 32"
//             style={{
//               display: "block",
//               fill: "none",
//               height: "16px",
//               width: "16px",
//               stroke: "currentColor",
//               strokeWidth: 4,
//               overflow: "visible",
//             }}
//             aria-hidden="true"
//             role="presentation"
//             focusable="false"
//           >
//             <path
//               fill="none"
//               d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9"
//             ></path>
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchFilters;
"use client";
import useSearchModal from "@/app/hooks/useSearchModal";
import { memo } from "react";

interface FilterButtonProps {
  label: string;
  subLabel: string;
  onClick: () => void;
  isLast?: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = memo(
  ({ label, subLabel, onClick, isLast = false }) => (
    <button
      onClick={onClick}
      className={`
        h-full px-6 py-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100
        ${!isLast ? 'border-r border-gray-200' : ''}
      `}
    >
      <div className="text-xs font-medium text-gray-900 mb-0.5">{label}</div>
      <div className="text-sm text-gray-500 truncate">{subLabel}</div>
    </button>
  )
);

FilterButton.displayName = "FilterButton";

const SearchFilters = () => {
  const searchModal = useSearchModal();

  const handleClick = (filter: string) => {
    searchModal.open(filter);
  };

  const handleMainClick = () => {
    handleClick("location");
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        <div
          className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleMainClick}
        >
          <FilterButton
            label="Where"
            subLabel="Search destinations"
            onClick={() => handleClick("location")}
          />
          <FilterButton
            label="Check in"
            subLabel="Add dates"
            onClick={() => handleClick("checkIn")}
          />
          <FilterButton
            label="Check out"
            subLabel="Add dates"
            onClick={() => handleClick("checkOut")}
          />
          <FilterButton
            label="Who"
            subLabel="Add guests"
            onClick={() => handleClick("guests")}
            isLast
          />

          {/* Search Button */}
          <div className="p-2">
            <button
              onClick={handleMainClick}
              className="bg-purple-600 hover:bg-purple-700 p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <button
          onClick={handleMainClick}
          className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600 p-2 rounded-full">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Where to?</div>
              <div className="text-xs text-gray-500">Anywhere • Any week • Add guests</div>
            </div>
          </div>

          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
