import React from "react";
import { Loader2 } from "lucide-react";

export interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  animating?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 20, className = "", animating = true }) => (
  <Loader2 className={`text-white ${animating ? "animate-spin" : ""} ${className}`} width={size} height={size} strokeWidth={2.5} />
);

export default LoadingSpinner;
