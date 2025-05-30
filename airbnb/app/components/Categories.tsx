// "use client";
// import { useState, useRef, useEffect } from "react";
// import Image from "next/image";
// import useSearchModal, { SearchQuery } from "../hooks/useSearchModal";

// const Categories = () => {
//   const searchModal = useSearchModal();
//   const [category, setCategory] = useState<string>("");
//   const containerRef = useRef<HTMLDivElement>(null);

//   const _setCategory = (_category: string) => {
//     console.log("Setting category:", _category); // Debug log
//     setCategory(_category);
//     const query: SearchQuery = {
//       country: searchModal.query.country,
//       checkIn: searchModal.query.checkIn,
//       checkOut: searchModal.query.checkOut,
//       guests: searchModal.query.guests,
//       bedrooms: searchModal.query.bedrooms,
//       bathrooms: searchModal.query.bathrooms,
//       category: _category,
//     };
//     searchModal.setQuery(query);
//     console.log("Query set to:", query);
//   };

//   const categoryItems = [
//     { label: "All", value: "", icon: "svg" },
//     { label: "Rooms", value: "Room", icon: "/rooms.jpg" },
//     { label: "Top Cities", value: "Top_Cities", icon: "/top_cities.jpg" },
//     { label: "Cabins", value: "Cabins", icon: "/cabins.jpg" },
//     { label: "Mansions", value: "Mansions", icon: "/mansions.jpg" },
//     { label: "Trending", value: "Trending", icon: "/trending.jpg" },
//     {
//       label: "Amazing Pools",
//       value: "Amazing_pools",
//       icon: "/amazing_pools.jpeg",
//     },
//     { label: "Farms House", value: "Farms_House", icon: "/farms_house.jpg" },
//   ];

//   const scrollContainer = (direction: "left" | "right") => {
//     if (containerRef.current) {
//       const scrollAmount = containerRef.current.clientWidth;
//       if (direction === "left") {
//         containerRef.current.scrollBy({
//           left: -scrollAmount,
//           behavior: "smooth",
//         });
//       } else {
//         containerRef.current.scrollBy({
//           left: scrollAmount,
//           behavior: "smooth",
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollLeft = 0; // Reset scroll position on mount
//     }
//   }, []);

//   return (
//     <div className="relative flex items-center justify-between px-4 mt-10 lg:mt-4">
//       <button
//         onClick={() => scrollContainer("left")}
//         className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 z-10"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.5}
//           stroke="currentColor"
//           className="w-6 h-6 text-gray-700"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M15.75 19.5L8.25 12l7.5-7.5"
//           />
//         </svg>
//       </button>
//       <div
//         ref={containerRef}
//         className="flex space-x-6 overflow-x-auto scrollbar-hide"
//         style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//       >
//         {categoryItems.map((item) => (
//           <div
//             key={item.value || "all"}
//             onClick={() => _setCategory(item.value)}
//             className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
//               category === item.value
//                 ? "border-gray-800 opacity-100"
//                 : "border-transparent opacity-60"
//             } hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out cursor-pointer`}
//           >
//             {item.icon === "svg" ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-6 h-6 text-gray-700"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
//                 />
//               </svg>
//             ) : (
//               <Image
//                 src={item.icon}
//                 alt={`${item.label} logo`}
//                 width={24}
//                 height={24}
//                 className="rounded-full"
//                 priority
//               />
//             )}
//             <span className="text-xs text-gray-700">{item.label}</span>
//           </div>
//         ))}
//       </div>
//       <button
//         onClick={() => scrollContainer("right")}
//         className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 z-10"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.5}
//           stroke="currentColor"
//           className="w-6 h-6 text-gray-700"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M8.25 4.5l7.5 7.5-7.5 7.5"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// };

// export default Categories;
"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import useSearchModal, { SearchQuery } from "../hooks/useSearchModal";

const Categories = () => {
  const searchModal = useSearchModal();
  const [category, setCategory] = useState<string>("");
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const _setCategory = (_category: string) => {
    console.log("Setting category:", _category);
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
    {
      label: "Amazing Pools",
      value: "Amazing_pools",
      icon: "/amazing_pools.jpeg",
    },
    { label: "Farms House", value: "Farms_House", icon: "/farms_house.jpg" },
  ];

  const checkScrollButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollContainer = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8;
      if (direction === "left") {
        containerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      } else {
        containerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
      // Check buttons after scroll animation
      setTimeout(checkScrollButtons, 300);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      checkScrollButtons();
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);

      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, []);

  return (
    <div className="relative w-full mt-10 lg:mt-4">
      {/* Left scroll button */}
      <button
        onClick={() => scrollContainer("left")}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
          showLeftButton ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        aria-label="Scroll left"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* Categories container */}
      <div className="px-4 sm:px-6 lg:px-12 relative">
        <div
          ref={containerRef}
          className="flex space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            maskImage: "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent 100%)"
          }}
        >
          {categoryItems.map((item, index) => (
            <div
              key={item.value || "all"}
              onClick={() => _setCategory(item.value)}
              className={`group pb-3 sm:pb-4 flex flex-col items-center justify-center space-y-2 border-b-2 cursor-pointer flex-shrink-0 min-w-[70px] sm:min-w-[80px] transition-all duration-300 ease-out ${
                category === item.value
                  ? "border-gray-800 opacity-100 transform scale-105"
                  : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: "fadeInUp 0.6s ease-out forwards"
              }}
            >
              {/* Icon container with enhanced animations */}
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 transition-all duration-300 group-hover:scale-110">
                {item.icon === "svg" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-full h-full text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
                    />
                  </svg>
                ) : (
                  <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-gray-300 transition-all duration-200">
                    <Image
                      src={item.icon}
                      alt={`${item.label} logo`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="32px"
                    />
                  </div>
                )}

                {/* Active indicator */}
                {category === item.value && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-white animate-pulse" />
                )}
              </div>

              {/* Label with better typography */}
              <span className={`text-xs sm:text-sm font-medium text-center transition-all duration-200 ${
                category === item.value
                  ? "text-gray-900 font-semibold"
                  : "text-gray-600 group-hover:text-gray-800"
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scrollContainer("right")}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
          showRightButton ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        aria-label="Scroll right"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Categories;
