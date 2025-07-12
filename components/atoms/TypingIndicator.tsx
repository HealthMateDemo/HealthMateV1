import React from "react";

interface TypingIndicatorProps {
  color?: string;
  size?: "sm" | "md";
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  color = "bg-slate-400",
  size = "md",
  className = ""
}) => {
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className={`${dotSize} ${color} rounded-full animate-bounce`}></div>
      <div
        className={`${dotSize} ${color} rounded-full animate-bounce`}
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className={`${dotSize} ${color} rounded-full animate-bounce`}
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
  );
};

export default TypingIndicator; 