interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "indigo" | "white" | "slate";
}

export default function LoadingSpinner({
  size = "md",
  color = "indigo",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colorClasses = {
    indigo: "border-indigo-500",
    white: "border-white",
    slate: "border-slate-500",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
