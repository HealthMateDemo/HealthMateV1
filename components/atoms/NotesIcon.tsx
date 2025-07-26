import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StickyNote } from "lucide-react";
import React from "react";
import NumberBadge from "./NumberBadge";

interface NotesIconProps {
  count: number;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

const NotesIcon: React.FC<NotesIconProps> = ({ count, onClick, isActive = false, className = "" }) => {
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
            <StickyNote className="w-5 h-5" />
            <div className="absolute -top-1 -right-1">
              <NumberBadge count={count} size="sm" variant="emerald" />
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Notes</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotesIcon;
