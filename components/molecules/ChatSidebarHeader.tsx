import React from "react";
import { Button } from "@/components/ui/button";
import GradientIcon from "@/components/atoms/GradientIcon";
import { Heart, Settings, X, Plus } from "lucide-react";

interface ChatSidebarHeaderProps {
  onClose: () => void;
  onToggleSettings: () => void;
  settingsOpen: boolean;
  settingsButtonRef: React.RefObject<HTMLButtonElement | null>;
  createNewConversation: () => void;
}

const ChatSidebarHeader: React.FC<ChatSidebarHeaderProps> = ({ onClose, onToggleSettings, settingsOpen, settingsButtonRef, createNewConversation }) => {
  return (
    <div className="p-4 border-b border-slate-200">
      <div className="flex items-center justify-between mb-4">
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
      <Button onClick={createNewConversation} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
        <Plus className="w-4 h-4 mr-2" />
        New Conversation
      </Button>
    </div>
  );
};

export default ChatSidebarHeader;
