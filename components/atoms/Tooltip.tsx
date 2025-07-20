import React from "react";
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip as UITooltip } from "../ui/tooltip";

interface TooltipProps {
  title: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ title, children }) => {
  return (
    <TooltipProvider>
      <UITooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="top">{title}</TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );
};

export default Tooltip;
