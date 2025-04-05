"use client";
import { useState, useEffect, useRef } from "react";

interface ModalProps {
  label: string;
  content: React.ReactElement;
  isOpen?: boolean;
  close: () => void;
  closeOnOutsideClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  label,
  content,
  isOpen = false,
  close,
  closeOnOutsideClick = true,
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    if (showModal && closeOnOutsideClick) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal, close, closeOnOutsideClick]);

  const handleClose = () => {
    close();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicks inside content from bubbling up
  };

  if (!showModal) return null;

  return (
    <div className="flex items-center justify-center fixed inset-0 z-50 bg-black/60">
      <div
        ref={modalRef}
        className="relative w-[90%] md:w-[80%] lg:w-[700px] my-6 mx-auto h-auto"
        onClick={handleContentClick} // Stop propagation here
      >
        <div
          className={`transition-all duration-500 ease-out transform ${
            showModal
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-10"
          }`}
        >
          <div className="w-full h-auto rounded-xl relative flex flex-col bg-white">
            <header className="h-[60px] flex items-center p-6 rounded-t justify-center relative border-b">
              <div
                onClick={handleClose}
                className="p-3 absolute right-3 hover:bg-gray-300 rounded-full cursor-pointer"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold">{label}</h2>
            </header>
            <section className="p-6">{content}</section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
