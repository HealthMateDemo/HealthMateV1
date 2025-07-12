import React from "react";
import { LucideIcon } from "lucide-react";

interface GradientIconProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const GradientIcon: React.FC<GradientIconProps> = ({ 
  icon: Icon, 
  size = "md",
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6"
  };

  return (
    <div className={`bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <Icon className={`${iconSizeClasses[size]} text-white`} />
    </div>
  );
};

export default GradientIcon; 