'use client';
import useSearchModal from "@/app/hooks/useSearchModal";
const SearchFilters = () => {
  const searchModal = useSearchModal();
  return (
    <div
    onClick={()=> searchModal.open('location')}
    className="h-[54px] flex flex-row items-center justify-between border rounded-full">
        {/* searchfilters */}
      <div className="hidden lg:block">
          <div className="flex flex-row items-center justify-between">
            <div className="cursor-pointer h-[55px] px-8 flex justify-center flex-col rounded-full relative overflow-hidden group">
                <p className="text-xs font-semibold z-10">Where</p>
                <p className="text-sm z-10">Wanted Location</p>
                <span className="absolute inset-0 w-full h-full bg-gray-300 transform scale-x-0 transition-all duration-300 group-hover:scale-x-100 origin-left z-0"></span>
            </div>

            <div className="cursor-pointer h-[55px] px-8 flex justify-center flex-col rounded-full relative overflow-hidden group">
                <p className="text-xs font-semibold z-10">Check-In</p>
                <p className="text-sm z-10">Add dates</p>
                <span className="absolute inset-0 w-full h-full bg-gray-300 transform scale-x-0 transition-all duration-300 group-hover:scale-x-100 origin-left z-0"></span>
            </div>

            <div className="cursor-pointer h-[55px] px-8 flex justify-center flex-col rounded-full relative overflow-hidden group">
                <p className="text-xs font-semibold z-10">Check-Out</p>
                <p className="text-sm z-10">Add dates</p>
                <span className="absolute inset-0 w-full h-full bg-gray-300 transform scale-x-0 transition-all duration-300 group-hover:scale-x-100 origin-left z-0"></span>
            </div>

            <div className="cursor-pointer h-[55px] px-8 flex justify-center flex-col rounded-full relative overflow-hidden group">
                <p className="text-xs font-semibold z-10">Who</p>
                <p className="text-sm z-10">Add guests</p>
                <span className="absolute inset-0 w-full h-full bg-gray-300 transform scale-x-0 transition-all duration-300 group-hover:scale-x-100 origin-left z-0"></span>
            </div>
          </div>

      </div>
      {/* Search icon */}
      <div className="p-2">
        <div className="cursor-pointer p-2 lg:p-4 bg-airbnb rounded-full text-white transition duration-300 ease-in-out transform hover:bg-airbnb-dark  hover:scale-105">
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
