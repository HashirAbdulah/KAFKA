import Image from "next/image";

const Categories = () =>{
    return(
        <div className="pt-3 cursor-pointer pb-6 flex items-center space-x-12">
                {/* Rooms */}
            <div className="pb-4 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out">
                <Image
                    src="/rooms.jpg"
                    alt="rooms logo"
                    width={20}
                    height={20}
                    />

                <span className="text-xs">Rooms</span>
            </div>
                {/* Top Cities */}
            <div className="pb-4 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out">
                <Image
                    src="/top_cities.jpg"
                    alt="beach logo"
                    width={20}
                    height={20}
                    />

                <span className="text-xs">Top Cities</span>
            </div>

                {/* Cabins */}
            <div className="pb-4 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out">
                <Image
                    src="/cabins.jpg"
                    alt="cabin logo"
                    width={20}
                    height={20}
                    />

                <span className="text-xs">Cabins</span>
            </div>
                {/* Mansions */}
            <div className="pb-4 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out">
                <Image
                    src="/mansions.jpg"
                    alt="mansions logo"
                    width={20}
                    height={20}
                    />

                <span className="text-xs">Mansions</span>
            </div>
                {/* Trending */}
            <div className="pb-4 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out">
                <Image
                    src="/trending.jpg"
                    alt="trending logo"
                    width={20}
                    height={20}
                    />

                <span className="text-xs">Trending</span>
            </div>
                {/* Amazing Pools */}
            <div className="pb-4 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out">
                <Image
                    src="/amazing pools.jpeg"
                    alt="amazing pools logo"
                    width={20}
                    height={20}
                    />

                <span className="text-xs">Amazing pools</span>
            </div>
              {/* FarmHouses */}
            <div className="pb-4 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100 transition-all duration-200 ease-in-out">
                <Image
                    src="/farms house.jpg"
                    alt="farms house logo"
                    width={20}
                    height={20}
                    />

                <span className="text-xs">Farms House</span>
            </div>

        </div>
    )
}

export default Categories;
