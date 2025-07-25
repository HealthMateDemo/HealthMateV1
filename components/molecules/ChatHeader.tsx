import ConversationDropdown from "@/components/atoms/ConversationDropdown";
import GradientIcon from "@/components/atoms/GradientIcon";
import TemplateCategory from "@/components/atoms/TemplateCategory";
import { Brain, Heart as HeartIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useState } from "react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "text" | "image" | "voice";
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  isSaved?: boolean;
  template?: "global" | "health" | "mindfull";
}

interface ChatHeaderProps {
  currentConversation: Conversation | null;
  favorites: string[];
  userCategories: string[];
  likeCount: number;
  dislikeCount: number;
  onClose: () => void;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setCurrentConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
  handleAssignCategory: (cat: string) => void;
  handleAssignTemplate: (template: "global" | "health" | "mindfull") => void;
  isNotesOpen: boolean;
  onNotesToggle: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentConversation,
  favorites,
  userCategories,
  likeCount,
  dislikeCount,
  onClose,
  setConversations,
  setCurrentConversation,
  handleAssignCategory,
  handleAssignTemplate,
  isNotesOpen,
  onNotesToggle,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const handleTitleEdit = () => {
    if (!currentConversation || !editedTitle.trim()) return;
    const updatedConversation = { ...currentConversation, title: editedTitle.trim() };
    setCurrentConversation(updatedConversation);
    setConversations((prev) => prev.map((conv) => (conv.id === currentConversation.id ? updatedConversation : conv)));
    setIsEditingTitle(false);
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditedTitle(currentConversation?.title || "");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleEdit();
    }
    if (e.key === "Escape") {
      setIsEditingTitle(false);
    }
  };

  const handleDeleteConversation = () => {
    if (!currentConversation) return;
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== currentConversation.id);
      setCurrentConversation(updated[0] || null);
      if (updated.length === 0) onClose();
      return updated;
    });
  };

  const getCategoryValue = () => {
    if (!currentConversation?.category) return "";
    return currentConversation.category.trim().toLowerCase();
  };

  const getCategoryBadge = () => {
    const cat = getCategoryValue();

    if (!cat) {
      return <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">Default</span>;
    }

    if (cat === "saved") {
      return <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">Saved</span>;
    }

    return <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>;
  };

  const getTemplateValue = () => {
    return currentConversation?.template || "global";
  };

  const getConversationTitle = () => {
    return currentConversation?.title || "New Conversation";
  };

  const getHeartIconClass = () => {
    if (!currentConversation) return "w-5 h-5 text-slate-400";
    const isFavorite = favorites.includes(currentConversation.id);
    return isFavorite ? "w-5 h-5 fill-emerald-500 text-emerald-500" : "w-5 h-5 text-slate-400";
  };

  const renderTitleInput = () => {
    return (
      <input
        className="font-semibold text-slate-800 text-lg border-b border-emerald-400 outline-none bg-transparent"
        value={editedTitle}
        autoFocus
        onChange={(e) => setEditedTitle(e.target.value)}
        onBlur={handleTitleEdit}
        onKeyDown={handleKeyDown}
      />
    );
  };

  const renderTitleDisplay = () => {
    return (
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-slate-800 cursor-pointer" title="Click to edit title" onClick={handleTitleClick}>
          {getConversationTitle()}
        </h2>
        {currentConversation && <HeartIcon className={getHeartIconClass()} />}
      </div>
    );
  };

  const renderControls = () => {
    if (!currentConversation) return null;

    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Category:</span>
        <select className="border rounded px-2 py-1 text-xs mr-2" value={getCategoryValue()} onChange={(e) => handleAssignCategory(e.target.value)}>
          <option value="">Default</option>
          <option value="saved">Saved</option>
          {userCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        {getCategoryBadge()}
        <span className="text-xs text-slate-500 ml-2">Template:</span>
        <select
          className="border rounded px-2 py-1 text-xs mr-2"
          value={getTemplateValue()}
          onChange={(e) => handleAssignTemplate(e.target.value as "global" | "health" | "mindfull")}
        >
          <option value="global">Global</option>
          <option value="health">Health</option>
          <option value="mindfull">Mindfull</option>
        </select>
        <TemplateCategory template={getTemplateValue()} className="text-xs ml-1">
          {getTemplateValue()}
        </TemplateCategory>
        <span className="flex items-center gap-1 ml-2">
          <ThumbsUp className="w-4 h-4 text-emerald-500" />
          <span className="text-xs text-emerald-700 font-semibold">{likeCount}</span>
          <ThumbsDown className="w-4 h-4 text-red-500 ml-2" />
          <span className="text-xs text-red-700 font-semibold">{dislikeCount}</span>
        </span>
      </div>
    );
  };

  return (
    <div className="p-4 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GradientIcon icon={Brain} size="lg" />
          <div>
            {isEditingTitle ? renderTitleInput() : renderTitleDisplay()}
            <p className="text-sm text-slate-500">AI Health Assistant • Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {renderControls()}
          <ConversationDropdown onDelete={handleDeleteConversation} onNotesClick={onNotesToggle} isNotesOpen={isNotesOpen} />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
