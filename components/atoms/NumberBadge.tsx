import React from "react";

interface NumberBadgeProps {
  count: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "emerald" | "blue" | "red" | "yellow";
}

const NumberBadge: React.FC<NumberBadgeProps> = ({ count, className = "", size = "sm", variant = "default" }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-1.5 py-0.5 text-[10px] min-w-[18px] h-[18px]";
      case "md":
        return "px-2 py-1 text-xs min-w-[20px] h-[20px]";
      case "lg":
        return "px-2.5 py-1.5 text-sm min-w-[24px] h-[24px]";
      default:
        return "px-1.5 py-0.5 text-[10px] min-w-[18px] h-[18px]";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "emerald":
        return "bg-emerald-500 text-white";
      case "blue":
        return "bg-blue-500 text-white";
      case "red":
        return "bg-red-500 text-white";
      case "yellow":
        return "bg-yellow-500 text-white";
      case "default":
      default:
        return "bg-slate-500 text-white";
    }
  };

  const baseClasses = "inline-flex items-center justify-center rounded-full font-bold";
  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();

  return <span className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}>{count}</span>;
};

export default NumberBadge;
