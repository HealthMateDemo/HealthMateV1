import { RotateCcw } from "lucide-react";
import React from "react";
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip as UITooltip } from "../ui/tooltip";

interface DislikeIconProps {
  onClick: () => void;
  className?: string;
  size?: number;
  tooltipText?: string;
}

const DislikeIcon: React.FC<DislikeIconProps> = ({ onClick, className = "", size = 16, tooltipText }) => {
  const buttonElement = (
    <button onClick={onClick} className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${className}`} aria-label="Toggle to disliked messages">
      <RotateCcw className={`text-slate-500 hover:text-slate-700`} size={size} />
    </button>
  );

  if (!tooltipText) {
    return buttonElement;
  }

  return (
    <TooltipProvider>
      <UITooltip>
        <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
        <TooltipContent side="top">{tooltipText}</TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );
};

export default DislikeIcon;
