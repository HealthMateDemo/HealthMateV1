import React from "react";

interface CategoryBadgeProps {
  category?: string;
  size?: "sm" | "md";
  className?: string;
}

const sizeClasses = {
  sm: "ml-1 px-1.5 py-0.5 text-[9px]",
  md: "ml-1 px-2 py-0.5 text-[10px]",
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = "md", className = "" }) => {
  const cat = typeof category === "string" ? category.trim().toLowerCase() : "";
  let bg = "bg-green-100 text-green-700";
  let label = "Default";
  if (cat === "saved") {
    label = "Saved";
  } else if (cat && cat !== "saved") {
    bg = "bg-blue-100 text-blue-700";
    label = cat.charAt(0).toUpperCase() + cat.slice(1);
  }
  return <span className={`rounded-full font-semibold ${bg} ${sizeClasses[size]} ${className}`}>{label}</span>;
};

export default CategoryBadge;
