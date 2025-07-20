import GradientIcon from "@/components/atoms/GradientIcon";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Settings, X } from "lucide-react";
import React from "react";
import ChatSidebarSearchBar from "../atoms/ChatSidebarSearchBar";

interface ChatSidebarHeaderProps {
  onClose: () => void;
  onToggleSettings: () => void;
  settingsOpen: boolean;
  settingsButtonRef: React.RefObject<HTMLButtonElement | null>;
  createNewConversation: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const ChatSidebarHeader: React.FC<ChatSidebarHeaderProps> = ({ onClose, onToggleSettings, settingsButtonRef, createNewConversation, searchTerm, setSearchTerm }) => {
  return (
    <div className="p-2 border-b border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GradientIcon icon={Heart} size="md" />
          <span className="font-semibold text-slate-800">ZenHealth AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button ref={settingsButtonRef} onClick={onToggleSettings} className="text-slate-500 hover:text-slate-700 p-1 rounded-full focus:outline-none">
            <Settings className="w-5 h-5" />
          </button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* New Conversation + Search Bar Row */}
      <div className="flex items-center gap-1 text-sm mt-2">
        <button
          onClick={createNewConversation}
          className="flex items-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded mr-2"
        >
          <span className="mr-2">
            <Plus className="size-4" />
          </span>
          New Conversation
        </button>
        <div className="flex-1">
          <ChatSidebarSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>
    </div>
  );
};

export default ChatSidebarHeader;
