import React from "react";
import Image from "next/image";
interface CategoriesProps {
  dataCategory: string;
  setCategory: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({
  dataCategory,
  setCategory,
}) => {
  return (
    <>
      <div className="pt-3 pb-6 ">
        <div className="cursor-pointer flex space-x-11 overflow-x-auto py-3 scroll-smooth">
          {/* Rooms */}
          <div
            onClick={() => setCategory("Room")}
            className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
              dataCategory == "Room" ? "border-gray-800" : "border-white"
            } opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out`}
          >
            <Image
              priority
              src="/rooms.jpg"
              alt="rooms logo"
              width={20}
              height={20}
            />

            <span className="text-xs">Rooms</span>
          </div>
          {/* Top Cities */}
          <div
            onClick={() => setCategory("Top_Cities")}
            className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
              dataCategory == "Top_Cities" ? "border-gray-800" : "border-white"
            } opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out`}
          >
            <Image
              priority
              src="/top_cities.jpg"
              alt="Top_Cities logo"
              width={20}
              height={20}
            />

            <span className="text-xs">Top Cities</span>
          </div>
          {/* Cabins */}
          <div
            onClick={() => setCategory("Cabins")}
            className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
              dataCategory == "Cabins" ? "border-gray-800" : "border-white"
            } opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out`}
          >
            <Image
              priority
              src="/cabins.jpg"
              alt="cabin logo"
              width={20}
              height={20}
            />

            <span className="text-xs">Cabins</span>
          </div>
          {/* Mansions */}
          <div
            onClick={() => setCategory("Mansions")}
            className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
              dataCategory == "Mansions" ? "border-gray-800" : "border-white"
            } opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out`}
          >
            <Image
              priority
              src="/mansions.jpg"
              alt="mansions logo"
              width={20}
              height={20}
            />

            <span className="text-xs">Mansions</span>
          </div>
          {/* Trending */}
          <div
            onClick={() => setCategory("Trending")}
            className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
              dataCategory == "Trending" ? "border-gray-800" : "border-white"
            } opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out`}
          >
            <Image
              priority
              src="/trending.jpg"
              alt="trending logo"
              width={20}
              height={20}
            />

            <span className="text-xs">Trending</span>
          </div>

          {/* Amazing Pools */}
          <div
            onClick={() => setCategory("Amazing_pools")}
            className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
              dataCategory == "Amazing_pools"
                ? "border-gray-800"
                : "border-white"
            } opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out`}
          >
            <Image
              priority
              src="/amazing pools.jpeg"
              alt="amazing pools logo"
              width={20}
              height={20}
            />

            <span className="text-xs">Amazing pools</span>
          </div>

          <div
            onClick={() => setCategory("Farms_House")}
            className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
              dataCategory == "Farms_House" ? "border-gray-800" : "border-white"
            } opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out`}
          >
            <Image
              priority
              src="/farms house.jpg"
              alt="farms house logo"
              width={20}
              height={20}
            />

            <span className="text-xs">Farms House</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
