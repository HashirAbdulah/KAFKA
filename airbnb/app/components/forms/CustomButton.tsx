// interface CustomButtonProps {
//   label: string | React.ReactElement;
//   className?: string;
//   onClick?: () => void; // Make optional since it's not always needed with type="submit"
//   icon?: React.ReactNode;
//   disabled?: boolean;
//   type?: "button" | "submit" | "reset"; // Add type prop with valid HTML button types
// }

// const CustomButton: React.FC<CustomButtonProps> = ({
//   label,
//   className,
//   onClick,
//   icon,
//   disabled,
//   type = "button", // Default to "button" if not provided
// }) => {
//   return (
//     <button
//       type={type} // Pass the type prop to the button
//       onClick={onClick}
//       disabled={disabled}
//       className={`w-full py-4 text-center bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition cursor-pointer ${className}`}
//     >
//       <div className="flex items-center justify-center gap-2">
//         {icon && (
//           <span className="flex items-center justify-center">{icon}</span>
//         )}
//         <span>{label}</span>
//       </div>
//     </button>
//   );
// };

// export default CustomButton;
interface CustomButtonProps {
  label: string | React.ReactElement;
  className?: string;
  onClick?: () => void; // Make optional since it's not always needed with type="submit"
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; // Add type prop with valid HTML button types
  variant?: "primary" | "secondary" | "outline" | "danger" | "success"; // Button variants
  size?: "small" | "medium" | "large"; // Button sizes
  loading?: boolean; // Loading state
  fullWidth?: boolean; // Full width option
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  className = "",
  onClick,
  icon,
  disabled = false,
  type = "button", // Default to "button" if not provided
  variant = "primary",
  size = "medium",
  loading = false,
  fullWidth = true,
}) => {
  // Base styles that apply to all buttons
  const baseStyles = `
    relative overflow-hidden font-semibold transition-all duration-300
    transform focus:ring-6 focus:outline-none cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : 'inline-flex'}
    ${!disabled && !loading ? 'hover:scale-[1.02] active:scale-[0.98]' : ''}
  `;

  // Size variants
  const sizeStyles = {
    small: "h-12 px-4 text-sm rounded-xl",
    medium: "h-14 px-6 text-base rounded-xl",
    large: "h-16 px-8 text-lg rounded-2xl"
  };

  // Color variants
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800
      text-white shadow-xl hover:shadow-2xl
      hover:from-purple-700 hover:via-purple-800 hover:to-purple-900
      focus:ring-purple-500/30
      disabled:hover:shadow-xl
    `,
    secondary: `
      bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800
      text-white shadow-lg hover:shadow-xl
      hover:from-gray-700 hover:via-gray-800 hover:to-gray-900
      focus:ring-gray-500/30
    `,
    outline: `
      bg-white border-2 border-purple-300 text-purple-700
      hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50
      hover:border-purple-400 hover:text-purple-800
      focus:ring-purple-500/20 shadow-sm hover:shadow-md
    `,
    danger: `
      bg-gradient-to-r from-red-600 via-red-700 to-red-800
      text-white shadow-xl hover:shadow-2xl
      hover:from-red-700 hover:via-red-800 hover:to-red-900
      focus:ring-red-500/30
    `,
    success: `
      bg-gradient-to-r from-green-600 via-green-700 to-green-800
      text-white shadow-xl hover:shadow-2xl
      hover:from-green-700 hover:via-green-800 hover:to-green-900
      focus:ring-green-500/30
    `
  };

  // Shimmer effect for gradient buttons
  const shouldShowShimmer = ['primary', 'secondary', 'danger', 'success'].includes(variant);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {/* Shimmer Effect */}
      {shouldShowShimmer && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      )}

      {/* Button Content */}
      <span className="relative flex items-center justify-center space-x-3">
        {loading ? (
          <>
            {/* Loading Spinner */}
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && (
              <span className="flex items-center justify-center transform transition-transform duration-200 group-hover:scale-110">
                {icon}
              </span>
            )}
            <span className="transition-all duration-200">
              {label}
            </span>
          </>
        )}
      </span>
    </button>
  );
};

export default CustomButton;
