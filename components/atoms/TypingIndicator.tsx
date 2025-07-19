import React from "react";

export interface TypingIndicatorProps {
  className?: string;
  dotColorClass?: string;
  size?: number;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className = "", dotColorClass = "bg-slate-400", size = 8 }) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`} aria-label="AI is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`inline-block rounded-full ${dotColorClass}`}
          style={{
            width: size,
            height: size,
            animation: `bounce 1s infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
