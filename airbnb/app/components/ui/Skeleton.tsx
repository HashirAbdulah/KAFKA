"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  type?: "text" | "image" | "avatar" | "card";
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "", type = "text" }) => {
  const baseClasses = "animate-pulse bg-gray-200 rounded";

  const typeClasses = {
    text: "h-4 w-3/4",
    image: "h-48 w-full",
    avatar: "h-12 w-12 rounded-full",
    card: "h-64 w-full rounded-lg"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`} />
  );
};

export default Skeleton;
