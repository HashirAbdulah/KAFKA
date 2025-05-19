interface CustomButtonProps {
  label: string | React.ReactElement;
  className?: string;
  onClick?: () => void; // Make optional since it's not always needed with type="submit"
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; // Add type prop with valid HTML button types
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  className,
  onClick,
  icon,
  disabled,
  type = "button", // Default to "button" if not provided
}) => {
  return (
    <button
      type={type} // Pass the type prop to the button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 text-center bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition cursor-pointer ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && (
          <span className="flex items-center justify-center">{icon}</span>
        )}
        <span>{label}</span>
      </div>
    </button>
  );
};

export default CustomButton;
