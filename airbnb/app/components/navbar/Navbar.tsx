// import Link from "next/link";
// import Image from "next/image";
// import SearchFilters from "./SearchFilters";
// import UserNav from "./UserNav";
// import AddPropertyButton from "./AddPropertyButton";
// import { getUserId } from "@/app/lib/action";
// const Navbar = async () => {
//   const userId = await getUserId();
//   return (
//     <nav className="w-full fixed top-0 left-0 py-6 border-b bg-white z-10">
//       <div className="max-w-[1650px] mx-auto px-6">
//         <div className="flex justify-between items-center">
//           <Link href="/">
//             <Image
//               src="/logo.png"
//               alt="Dara logo"
//               width={100}
//               height={100}
//               style={{ width: "auto", height: "auto" }}
//               priority
//             />
//           </Link>

//           <div className="flex space-x-6">
//             <SearchFilters />
//           </div>

//           <div className="flex items-center space-x-6">
//             <AddPropertyButton userId={userId} />
//             <UserNav userId={userId} />
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import Link from "next/link";
import Image from "next/image";
import SearchFilters from "./SearchFilters";
import UserNav from "./UserNav";
import AddPropertyButton from "./AddPropertyButton";
import { getUserId } from "@/app/lib/action";

const Navbar = async () => {
  const userId = await getUserId();

  return (
    <nav className="w-full fixed top-0 left-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.png"
              alt="Dara logo"
              width={120}
              height={40}
              style={{ width: "auto", height: "32px" }}
              priority
              className="lg:h-10"
            />
          </Link>

          {/* Desktop Search - Center */}
          <div className="hidden lg:flex flex-1 justify-center max-w-2xl mx-8">
            <SearchFilters />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <AddPropertyButton userId={userId} />
            <UserNav userId={userId} />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <SearchFilters />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
