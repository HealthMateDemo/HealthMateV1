import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HelpCircle, Image, MoreVertical, StickyNote, Trash2 } from "lucide-react";
import React from "react";

interface ConversationDropdownProps {
  onDelete: () => void;
  onNotesClick: () => void;
  onImagesClick: () => void;
  onInfoClick: () => void;
  isNotesOpen: boolean;
  isImagesOpen: boolean;
  isInfoOpen: boolean;
}

const ConversationDropdown: React.FC<ConversationDropdownProps> = ({ onDelete, onNotesClick, onImagesClick, onInfoClick, isNotesOpen, isImagesOpen, isInfoOpen }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-slate-500 hover:text-slate-700 p-1 rounded-full focus:outline-none" aria-label="Conversation options">
          <MoreVertical className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:bg-red-50 focus:text-red-700">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete conversation
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onNotesClick} className={`focus:bg-emerald-50 focus:text-emerald-700 ${isNotesOpen ? "bg-emerald-50 text-emerald-700" : "text-slate-700"}`}>
          <StickyNote className="w-4 h-4 mr-2" />
          Notes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onImagesClick} className={`focus:bg-emerald-50 focus:text-emerald-700 ${isImagesOpen ? "bg-emerald-50 text-emerald-700" : "text-slate-700"}`}>
          <Image className="w-4 h-4 mr-2" />
          Images
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onInfoClick} className={`focus:bg-emerald-50 focus:text-emerald-700 ${isInfoOpen ? "bg-emerald-50 text-emerald-700" : "text-slate-700"}`}>
          <HelpCircle className="w-4 h-4 mr-2" />
          Info & Resources
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationDropdown;
