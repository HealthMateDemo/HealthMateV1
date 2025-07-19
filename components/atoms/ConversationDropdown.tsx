import React from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ConversationDropdownProps {
  onDelete: () => void;
}

const ConversationDropdown: React.FC<ConversationDropdownProps> = ({ onDelete }) => {
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationDropdown;
