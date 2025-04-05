"use client";

import { useState, useRef, useEffect } from "react";
import MenuLink from "./MenuLink";
import useLoginModal from "@/app/hooks/useLoginModal";
import useSignupModal from "@/app/hooks/useSignupModal";
import LogoutButton from "../logoutButton";
import LoginModal from "../modals/LoginModal";

interface UserNavProps {
  userId?: string | null;
}

const UserNav: React.FC<UserNavProps> = ({ userId }) => {
  const loginModal = useLoginModal();
  const signupModal = useSignupModal();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Close the menu only if click is outside both button and menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-2 cursor-pointer relative inline-block border rounded-full hover:shadow-md hover:shadow-gray-400 transition-shadow duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center"
        ref={buttonRef}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="w-[220px] absolute top-[50px] right-0 bg-white border rounded-xl shadow-md flex flex-col cursor-pointer"
        >
          {userId ? (
            <>
              <LogoutButton />
              <MenuLink
                label="Airbnb Your Home"
                onClick={() => console.log("Clicked Airbnb Your Home Button")}
              />
              <MenuLink
                label="Host an Experience"
                onClick={() => console.log("Clicked Host an Experience Button")}
              />
            </>
          ) : (
            <>
              <MenuLink
                label="Login"
                onClick={() => {
                  setIsOpen(false);
                  loginModal.open();
                }}
              />
              <MenuLink
                label="Sign Up"
                onClick={() => {
                  setIsOpen(false);
                  signupModal.open();
                }}
              />
            </>
          )}
          <hr />
          <MenuLink
            label="Help Center"
            onClick={() => console.log("Clicked Help Center Button")}
          />
        </div>
      )}

      <LoginModal /> {/* No need for extra div or ref */}
    </div>
  );
};

export default UserNav;
