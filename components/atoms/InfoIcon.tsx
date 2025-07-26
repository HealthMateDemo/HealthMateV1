import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import React from "react";
import NumberBadge from "./NumberBadge";

interface InfoIconProps {
  count: number;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ count, onClick, isActive = false, className = "" }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={`relative flex items-center justify-center p-2 rounded-lg transition-colors ${
              isActive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
            } ${className}`}
          >
            <Info className="w-5 h-5" />
            <div className="absolute -top-1 -right-1">
              <NumberBadge count={count} size="sm" variant="emerald" />
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Info & Resources</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoIcon;
