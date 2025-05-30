// "use client";
// import useSearchModal from "@/app/hooks/useSearchModal";
// import { memo } from "react";

// interface FilterButtonProps {
//   label: string;
//   subLabel: string;
//   onClick: () => void;
//   isLast?: boolean;
// }

// const FilterButton: React.FC<FilterButtonProps> = memo(
//   ({ label, subLabel, onClick, isLast = false }) => (
//     <button
//       onClick={onClick}
//       className={`
//         h-full px-6 py-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100
//         ${!isLast ? 'border-r border-gray-200' : ''}
//       `}
//     >
//       <div className="text-xs font-medium text-gray-900 mb-0.5">{label}</div>
//       <div className="text-sm text-gray-500 truncate">{subLabel}</div>
//     </button>
//   )
// );

// FilterButton.displayName = "FilterButton";

// const SearchFilters = () => {
//   const searchModal = useSearchModal();

//   const handleClick = (filter: string) => {
//     searchModal.open(filter);
//   };

//   const handleMainClick = () => {
//     handleClick("location");
//   };

//   return (
//     <div className="w-full max-w-4xl">
//       {/* Desktop Layout */}
//       <div className="hidden lg:flex">
//         <div
//           className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//           onClick={handleMainClick}
//         >
//           <FilterButton
//             label="Where"
//             subLabel="Search destinations"
//             onClick={() => handleClick("location")}
//           />
//           <FilterButton
//             label="Check in"
//             subLabel="Add dates"
//             onClick={() => handleClick("checkIn")}
//           />
//           <FilterButton
//             label="Check out"
//             subLabel="Add dates"
//             onClick={() => handleClick("checkOut")}
//           />
//           <FilterButton
//             label="Who"
//             subLabel="Add guests"
//             onClick={() => handleClick("guests")}
//             isLast
//           />

//           {/* Search Button */}
//           <div className="p-2">
//             <button
//               onClick={handleMainClick}
//               className="bg-purple-600 hover:bg-purple-700 p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
//               aria-label="Search"
//             >
//               <svg
//                 className="w-4 h-4 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2.5}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Layout */}
//       <div className="lg:hidden">
//         <button
//           onClick={handleMainClick}
//           className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
//         >
//           <div className="flex items-center space-x-3">
//             <div className="bg-purple-600 p-2 rounded-full">
//               <svg
//                 className="w-4 h-4 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2.5}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </div>
//             <div className="text-left">
//               <div className="text-sm font-medium text-gray-900">Where to?</div>
//               <div className="text-xs text-gray-500">Anywhere • Any week • Add guests</div>
//             </div>
//           </div>

//           <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
//             <svg
//               className="w-4 h-4 text-gray-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
//               />
//             </svg>
//           </div>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SearchFilters;
"use client";
import useSearchModal from "@/app/hooks/useSearchModal";
import { motion, AnimatePresence } from "framer-motion";
import { memo, useState } from "react";

interface FilterButtonProps {
  label: string;
  subLabel: string;
  onClick: () => void;
  isLast?: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = memo(
  ({ label, subLabel, onClick, isLast = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          h-full px-6 py-3 text-left transition-colors
          ${!isLast ? 'border-r border-gray-200' : ''}
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        `}
        whileHover={{ backgroundColor: "#f7fafc" }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="text-xs font-medium text-gray-900 mb-0.5"
          animate={{ y: isHovered ? -2 : 0 }}
        >
          {label}
        </motion.div>
        <motion.div
          className="text-sm text-gray-500 truncate"
          animate={{ y: isHovered ? -2 : 0 }}
        >
          {subLabel}
        </motion.div>
      </motion.button>
    );
  }
);

FilterButton.displayName = "FilterButton";

const SearchFilters = () => {
  const searchModal = useSearchModal();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (filter: string) => {
    searchModal.open(filter);
  };

  const handleMainClick = () => {
    handleClick("location");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Desktop Layout */}
      <motion.div
        className="hidden lg:flex"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          onClick={handleMainClick}
          whileHover={{ scale: 1.02 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div variants={itemVariants}>
            <FilterButton
              label="Where"
              subLabel="Search destinations"
              onClick={() => handleClick("location")}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FilterButton
              label="Check in"
              subLabel="Add dates"
              onClick={() => handleClick("checkIn")}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FilterButton
              label="Check out"
              subLabel="Add dates"
              onClick={() => handleClick("checkOut")}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FilterButton
              label="Who"
              subLabel="Add guests"
              onClick={() => handleClick("guests")}
              isLast
            />
          </motion.div>

          {/* Search Button */}
          <motion.div
            className="p-2"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={handleMainClick}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label="Search"
            >
              <motion.svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isHovered ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </motion.svg>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Mobile Layout */}
      <motion.div
        className="lg:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.button
          onClick={handleMainClick}
          className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="flex items-center space-x-3"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
          >
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
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
            </motion.div>
            <div className="text-left">
              <motion.div
                className="text-sm font-medium text-gray-900"
                animate={{ y: isHovered ? -2 : 0 }}
              >
                Where to?
              </motion.div>
              <motion.div
                className="text-xs text-gray-500"
                animate={{ y: isHovered ? -2 : 0 }}
              >
                Anywhere • Any week • Add guests
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1, backgroundColor: "#e5e7eb" }}
          >
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
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SearchFilters;
