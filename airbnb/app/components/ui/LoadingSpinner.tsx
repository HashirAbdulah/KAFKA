"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`
        ${sizeClasses[size]}
        animate-spin
        rounded-full
        border-4
        border-gray-200
        border-t-blue-500
      `} />
    </div>
  );
};

export default LoadingSpinner;
