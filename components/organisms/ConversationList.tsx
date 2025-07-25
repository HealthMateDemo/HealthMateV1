import CategoryBadge from "@/components/atoms/CategoryBadge";
import NumberBadge from "@/components/atoms/NumberBadge";
import TemplateCategory from "@/components/atoms/TemplateCategory";
import { Archive, Brain, Heart as HeartIcon, MessageCircle, MessageSquare, Save, ThumbsDown, ThumbsUp } from "lucide-react";
import React from "react";

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

interface ConversationListProps {
  filteredConversations: Conversation[];
  currentConversation: Conversation | null;
  handleSelectConversation: (conversationId: string) => void;
  aiFeedback: { [id: string]: "like" | "dislike" | undefined };
  favorites: string[];
  toggleFavorite: (conversationId: string) => void;
  handleArchive: (conversationId: string) => void;
  sidebarView: "conversations" | "messages";
  setSidebarView: (view: "conversations" | "messages") => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  filteredConversations,
  currentConversation,
  handleSelectConversation,
  aiFeedback,
  favorites,
  toggleFavorite,
  handleArchive,
  sidebarView,
  setSidebarView,
}) => {
  const conversationCount = filteredConversations.length;

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-700 text-sm flex items-center gap-2 flex-1 justify-center">
          Conversations
          <NumberBadge count={conversationCount} variant="emerald" />
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSidebarView("conversations")}
            className={`p-1.5 rounded-md transition-colors ${
              sidebarView === "conversations" ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
            aria-label="Show conversations"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSidebarView("messages")}
            className={`p-1.5 rounded-md transition-colors ${
              sidebarView === "messages" ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
            aria-label="Show recent messages"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
      {filteredConversations.map((conversation, idx) => {
        // Calculate like/dislike counts for this conversation
        const aiMsgs = conversation.messages.filter((m) => m.sender === "ai");
        const likeCount = aiMsgs.filter((m) => aiFeedback[m.id] === "like").length;
        const dislikeCount = aiMsgs.filter((m) => aiFeedback[m.id] === "dislike").length;
        return (
          <div
            key={typeof conversation.id === "string" && conversation.id.trim().length > 0 ? conversation.id : `conv-fallback-${idx}`}
            onClick={() => handleSelectConversation(conversation.id)}
            className={`relative p-3 rounded-lg cursor-pointer transition-colors ${
              currentConversation?.id === conversation.id ? "bg-emerald-100 border border-emerald-200" : "hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-slate-800 truncate text-sm flex items-center gap-2">
                {conversation.title}
                <CategoryBadge category={conversation.category} size="md" />
                <TemplateCategory template={conversation.template || "global"} className="text-xs">
                  {conversation.template || "global"}
                </TemplateCategory>
              </h4>
              <div className="flex items-center gap-2">
                {conversation.isSaved && <Save className="w-3 h-3 text-emerald-500" />}
                <span className="flex items-center gap-1 ml-2">
                  <ThumbsUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-emerald-700 font-semibold">{likeCount}</span>
                  <ThumbsDown className="w-3 h-3 text-red-500 ml-1" />
                  <span className="text-xs text-red-700 font-semibold">{dislikeCount}</span>
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              {conversation.messages.length} messages
              <span className="flex items-center gap-1 ml-2">
                <Brain className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-700">{conversation.messages.filter((m) => m.sender === "ai").length}</span>
                <MessageCircle className="w-3 h-3 text-slate-500 ml-2" />
                <span className="text-xs text-slate-700">{conversation.messages.filter((m) => m.sender === "user").length}</span>
              </span>
            </p>
            <p className="text-xs text-slate-400">{conversation.updatedAt instanceof Date ? conversation.updatedAt.toLocaleDateString("en-US") : ""}</p>
            {/* Action buttons at bottom right */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              {/* Archive icon */}
              <button
                className="p-1 rounded-full bg-white/80 hover:bg-slate-100 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchive(conversation.id);
                }}
                aria-label="Archive conversation"
              >
                <Archive className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
              {/* Heart (favorite) icon */}
              <button
                className="p-1 rounded-full bg-white/80 hover:bg-emerald-100 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(conversation.id);
                }}
                aria-label={favorites.includes(conversation.id) ? "Unfavorite" : "Favorite"}
              >
                <HeartIcon className={`w-4 h-4 ${favorites.includes(conversation.id) ? "fill-emerald-500 text-emerald-500" : "text-slate-400"}`} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
