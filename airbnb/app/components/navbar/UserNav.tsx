// "use client";
// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import MenuLink from "./MenuLink";
// import useAuthModals from "@/app/hooks/useAuthModals";
// import LogoutButton from "../logoutButton";
// import LoginModal from "../modals/LoginModal";
// import SignupModal from "../modals/SignupModal";
// import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";

// interface UserNavProps {
//   userId?: string | null;
// }

// const UserNav: React.FC<UserNavProps> = ({ userId }) => {
//   const { openLoginModal, openSignupModal } = useAuthModals();
//   const router = useRouter();
//   const addPropertyModal = useAddPropertyModal();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const buttonRef = useRef<HTMLButtonElement | null>(null);
//   const menuRef = useRef<HTMLDivElement | null>(null);

//   const handleToggle = () => {
//     if (isOpen) {
//       setIsAnimating(true);
//       setTimeout(() => {
//         setIsOpen(false);
//         setIsAnimating(false);
//       }, 200);
//     } else {
//       setIsOpen(true);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         buttonRef.current &&
//         !buttonRef.current.contains(event.target as Node) &&
//         menuRef.current &&
//         !menuRef.current.contains(event.target as Node)
//       ) {
//         handleToggle();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   // Close menu on route change
//   useEffect(() => {
//     const handleRouteChange = () => {
//       if (isOpen) {
//         setIsOpen(false);
//       }
//     };

//     // Listen for route changes (if using Next.js router events)
//     return () => {
//       handleRouteChange();
//     };
//   }, [isOpen]);

//   const menuItems = userId ? [
//     { label: "Profile", path: "/profile", icon: "user" },
//     { label: "Inbox", path: "/inbox", icon: "mail" },
//     { label: "My Properties", path: "/myproperties", icon: "home" },
//     { label: "My Reservations", path: "/reservations", icon: "calendar" },
//     { label: "My Favourites", path: "/myfavourites", icon: "heart" },
//   ] : [
//     { label: "Login", action: "login", icon: "login" },
//     { label: "Sign Up", action: "signup", icon: "userPlus" },
//   ];

//   const handleMenuClick = (item: any) => {
//     setIsOpen(false);

//     if (item.path) {
//       router.push(item.path);
//     } else if (item.action === "login") {
//       openLoginModal();
//     } else if (item.action === "signup") {
//       openSignupModal();
//     }
//   };

//   const getMenuIcon = (iconType: string) => {
//     const iconClass = "w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-200";

//     switch (iconType) {
//       case "user":
//         return (
//           <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
//           </svg>
//         );
//       case "mail":
//         return (
//           <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 21.75 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
//           </svg>
//         );
//       case "home":
//         return (
//           <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
//           </svg>
//         );
//       case "calendar":
//         return (
//           <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
//           </svg>
//         );
//       case "heart":
//         return (
//           <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
//           </svg>
//         );
//       case "login":
//         return (
//           <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V6a3 3 0 0 1 6 0v3m-3 4.5h.008v.008H12v-.008ZM21 10.5h-2.25a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3H21a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3Z" />
//           </svg>
//         );
//       case "userPlus":
//         return (
//           <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
//           </svg>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="relative">
//       {/* Main button */}
//       <button
//         onClick={handleToggle}
//         ref={buttonRef}
//         className={`group relative p-2 sm:p-3 cursor-pointer border rounded-full transition-all duration-300 ease-out ${
//           isOpen
//             ? "shadow-lg shadow-gray-400/30 border-gray-300 bg-gray-50 scale-105"
//             : "hover:shadow-md hover:shadow-gray-400/20 border-gray-200 bg-white hover:border-gray-300 hover:scale-105"
//         }`}
//         aria-label="User menu"
//         aria-expanded={isOpen}
//       >
//         <div className="flex items-center space-x-1 sm:space-x-2">
//           {/* Hamburger menu icon */}
//           <div className="relative w-5 h-5 sm:w-6 sm:h-6">
//             <div className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-0' : ''}`}>
//               <div className={`w-full h-0.5 bg-gray-600 absolute top-1 transition-all duration-300 ${isOpen ? 'rotate-90 top-2.5' : ''}`} />
//               <div className={`w-full h-0.5 bg-gray-600 absolute top-2.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
//               <div className={`w-full h-0.5 bg-gray-600 absolute top-4 transition-all duration-300 ${isOpen ? '-rotate-90 top-2.5' : ''}`} />
//             </div>
//           </div>

//           {/* User avatar */}
//           <div className="relative">
//             <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center transition-all duration-300 group-hover:from-gray-500 group-hover:to-gray-700">
//               <svg
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="2"
//                 stroke="white"
//                 className="w-3 h-3 sm:w-4 sm:h-4"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
//                 />
//               </svg>
//             </div>
//             {/* Online indicator for logged in users */}
//             {userId && (
//               <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
//             )}
//           </div>
//         </div>
//       </button>

//       {/* Dropdown menu */}
//       {(isOpen || isAnimating) && (
//         <div
//           ref={menuRef}
//           className={`absolute top-full right-0 mt-2 w-56 sm:w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 origin-top-right ${
//             isOpen && !isAnimating
//               ? "opacity-100 scale-100 translate-y-0"
//               : "opacity-0 scale-95 -translate-y-2"
//           }`}
//           style={{
//             transformOrigin: "top right",
//           }}
//         >
//           {/* Menu header */}
//           <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
//                 <svg
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="2"
//                   stroke="white"
//                   className="w-4 h-4"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
//                   />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-sm font-semibold text-gray-900">
//                   {userId ? "Account" : "Welcome"}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {userId ? "Manage your account" : "Sign in to continue"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Menu items */}
//           <div className="py-2">
//             {menuItems.map((item, index) => (
//               <div
//                 key={item.label}
//                 onClick={() => handleMenuClick(item)}
//                 className="group flex items-center px-4 py-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-gray-300"
//                 style={{
//                   animationDelay: `${index * 50}ms`,
//                   animation: isOpen ? "slideIn 0.3s ease-out forwards" : undefined
//                 }}
//               >
//                 <div className="mr-3 transition-transform duration-200 group-hover:scale-110">
//                   {getMenuIcon(item.icon)}
//                 </div>
//                 <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
//                   {item.label}
//                 </span>
//                 <svg
//                   className="ml-auto w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-200"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//                 </svg>
//               </div>
//             ))}

//             {/* Additional menu items for logged in users */}
//             {userId && (
//               <>
//                 <hr className="my-2 border-gray-200" />
//                 <div
//                   onClick={() => {
//                     setIsOpen(false);
//                     addPropertyModal.open();
//                   }}
//                   className="group flex items-center px-4 py-3 hover:bg-purple-50 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-purple-300"
//                 >
//                   <div className="mr-3 transition-transform duration-200 group-hover:scale-110">
//                     <svg className="w-4 h-4 text-purple-500 group-hover:text-purple-700 transition-colors duration-200" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//                     </svg>
//                   </div>
//                   <span className="text-sm font-medium text-purple-700 group-hover:text-purple-900 transition-colors duration-200">
//                     Dara Your Home
//                   </span>
//                 </div>
//                 <LogoutButton />
//               </>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
//             <div
//               onClick={() => {
//                 setIsOpen(false);
//                 router.push("/help");
//               }}
//               className="group flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
//             >
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
//               </svg>
//               <span className="font-medium">Help Center</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modals */}
//       <LoginModal />
//       <SignupModal />

//       <style jsx>{`
//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateX(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default UserNav;
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import MenuLink from "./MenuLink";
import useAuthModals from "@/app/hooks/useAuthModals";
import LogoutButton from "../logoutButton";
import LoginModal from "../modals/LoginModal";
import SignupModal from "../modals/SignupModal";
import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";
import { motion } from "framer-motion";

interface UserNavProps {
  userId?: string | null;
}

const UserNav: React.FC<UserNavProps> = ({ userId }) => {
  const { openLoginModal, openSignupModal } = useAuthModals();
  const router = useRouter();
  const addPropertyModal = useAddPropertyModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      }, 200);
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        handleToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    return () => {
      handleRouteChange();
    };
  }, [isOpen]);

  const menuItems = userId
    ? [
        { label: "Profile", path: "/profile", icon: "user" },
        { label: "Inbox", path: "/inbox", icon: "mail" },
        { label: "My Properties", path: "/myproperties", icon: "home" },
        { label: "My Reservations", path: "/reservations", icon: "calendar" },
        { label: "My Favourites", path: "/myfavourites", icon: "heart" },
      ]
    : [
        { label: "Login", action: "login", icon: "login" },
        { label: "Sign Up", action: "signup", icon: "userPlus" },
      ];

  const handleMenuClick = (item: any) => {
    setIsOpen(false);

    if (item.path) {
      router.push(item.path);
    } else if (item.action === "login") {
      openLoginModal();
    } else if (item.action === "signup") {
      openSignupModal();
    }
  };

  const getMenuIcon = (iconType: string) => {
    const iconClass =
      "w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-200";

    switch (iconType) {
      case "user":
        return (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        );
      case "mail":
        return (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 21.75 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        );
      case "home":
        return (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        );
      case "calendar":
        return (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
        );
      case "heart":
        return (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        );
      case "login":
        return (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V6a3 3 0 0 1 6 0v3m-3 4.5h.008v.008H12v-.008ZM21 10.5h-2.25a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3H21a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3Z"
            />
          </svg>
        );
      case "userPlus":
        return (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Main button */}
      <motion.button
        onClick={handleToggle}
        ref={buttonRef}
        className={`group relative p-2 sm:p-3 cursor-pointer border rounded-full transition-all duration-300 ease-out ${
          isOpen
            ? "shadow-lg shadow-gray-400/30 border-gray-300 bg-gray-50 scale-105"
            : "hover:shadow-md hover:shadow-gray-400/20 border-gray-200 bg-white hover:border-gray-300 hover:scale-105"
        }`}
        aria-label="User menu"
        aria-expanded={isOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Hamburger menu icon */}
          <div className="relative w-5 h-5 sm:w-6 sm:h-6">
            <div
              className={`absolute inset-0 transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-0" : ""
              }`}
            >
              <div
                className={`w-full h-0.5 bg-gray-600 absolute top-1 transition-all duration-300 ${
                  isOpen ? "rotate-90 top-2.5" : ""
                }`}
              />
              <div
                className={`w-full h-0.5 bg-gray-600 absolute top-2.5 transition-all duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <div
                className={`w-full h-0.5 bg-gray-600 absolute top-4 transition-all duration-300 ${
                  isOpen ? "-rotate-90 top-2.5" : ""
                }`}
              />
            </div>
          </div>

          {/* User avatar */}
          <div className="relative">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center transition-all duration-300 group-hover:from-gray-500 group-hover:to-gray-700">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="white"
                className="w-3 h-3 sm:w-4 sm:h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            {/* Online indicator for logged in users */}
            {userId && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </motion.button>

      {/* Dropdown menu */}
      {(isOpen || isAnimating) && (
        <motion.div
          ref={menuRef}
          className="absolute top-full right-0 mt-2 w-56 sm:w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{
            transformOrigin: "top right",
          }}
        >
          {/* Menu header */}
          <motion.div
            className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 cursor-pointer"
            onClick={() => {
              if (userId) {
                setIsOpen(false);
                router.push("/profile");
              }
            }}
            whileHover={{ backgroundColor: "#f3f4f6" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="white"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <div>
              <motion.p
                className="text-sm font-semibold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {userId ? "Account" : "Welcome"}
              </motion.p>
              <motion.p
                className="text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {userId ? "Manage your account" : "Sign in to continue"}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Menu items */}
        <div className="py-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              onClick={() => handleMenuClick(item)}
              className="group flex items-center px-4 py-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-gray-300"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="mr-3 transition-transform duration-200 group-hover:scale-110">
                {getMenuIcon(item.icon)}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                {item.label}
              </span>
              <svg
                className="ml-auto w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-200"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </motion.div>
          ))}

          {/* Additional menu items for logged in users */}
          {userId && (
            <>
              <hr className="my-2 border-gray-200" />
              <motion.div
                onClick={() => {
                  setIsOpen(false);
                  addPropertyModal.open();
                }}
                className="group flex items-center px-4 py-3 hover:bg-purple-50 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-purple-300"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: menuItems.length * 0.05 }}
              >
                <div className="mr-3 transition-transform duration-200 group-hover:scale-110">
                  <svg
                    className="w-4 h-4 text-purple-500 group-hover:text-purple-700 transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-purple-700 group-hover:text-purple-900 transition-colors duration-200">
                  Dara Your Home
                </span>
              </motion.div>
              <LogoutButton />
            </>
          )}
        </div>

        {/* Footer */}
        <motion.div
          className="border-t border-gray-200 px-4 py-3 bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: (menuItems.length + 1) * 0.05 }}
        >
          <div
            onClick={() => {
              setIsOpen(false);
              router.push("/help");
            }}
            className="group flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              />
            </svg>
            <span className="font-medium">Help Center</span>
          </div>
        </motion.div>
      </motion.div>
    )}

    {/* Modals */}
    <LoginModal />
    <SignupModal />
  </div>
);
};

export default UserNav;
