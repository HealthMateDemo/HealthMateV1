import { Bot, MessageCircle, MessageSquare, User } from "lucide-react";
import React, { useState } from "react";
import NumberBadge from "../atoms/NumberBadge";
import Tooltip from "../atoms/Tooltip";

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
}

interface RecentMessagesSectionProps {
  conversations: Conversation[];
  sidebarView: "conversations" | "messages";
  setSidebarView: (view: "conversations" | "messages") => void;
  onSelectConversation?: (conversationId: string) => void;
}

const RecentMessagesSection: React.FC<RecentMessagesSectionProps> = ({ conversations, sidebarView, setSidebarView, onSelectConversation }) => {
  const [showAI, setShowAI] = useState(false);

  // Gather all user messages with conversation reference
  const allUserMessages = conversations.flatMap((conv) =>
    conv.messages
      .filter((msg) => msg.sender === "user")
      .map((msg) => ({
        ...msg,
        conversationTitle: conv.title,
        conversationId: conv.id,
      })),
  );

  // Gather all AI messages with conversation reference
  const allAIMessages = conversations.flatMap((conv) =>
    conv.messages
      .filter((msg) => msg.sender === "ai")
      .map((msg) => ({
        ...msg,
        conversationTitle: conv.title,
        conversationId: conv.id,
      })),
  );

  // Sort by timestamp descending and take the latest 3
  const latestUserMessages = allUserMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3);
  const latestAIMessages = allAIMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3);

  const messagesToShow = showAI ? latestAIMessages : latestUserMessages;
  const totalUserMessages = allUserMessages.length;
  const totalAIMessages = allAIMessages.length;

  const icon = showAI ? (
    <Tooltip title="Show user messages">
      <User className="w-4 h-4 cursor-pointer text-emerald-500" onClick={() => setShowAI(false)} />
    </Tooltip>
  ) : (
    <Tooltip title="Show AI messages">
      <Bot className="w-4 h-4 cursor-pointer text-emerald-500" onClick={() => setShowAI(true)} />
    </Tooltip>
  );

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-700 text-sm flex items-center gap-2 flex-1 justify-center">
          Recent Messages
          <NumberBadge count={totalUserMessages + totalAIMessages} variant="emerald" />
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

      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xs text-slate-500">{showAI ? "AI Messages" : "User Messages"}</span>
        {icon}
      </div>

      <ul className="space-y-2 max-w-[320px]">
        {messagesToShow.length === 0 && <li className="text-xs text-slate-400 italic text-center">{showAI ? "No AI messages yet" : "No user messages yet"}</li>}
        {messagesToShow.map((msg) => (
          <li
            key={msg.id}
            className="border-b border-slate-100 last:border-b-0 text-xs space-y-0.5 bg-green-100 rounded-lg cursor-pointer hover:bg-green-200 transition-colors"
            onClick={() => onSelectConversation && onSelectConversation(msg.conversationId)}
          >
            <div className="font-semibold ml-2 text-xs text-slate-800 truncate pt-2">{msg.conversationTitle}</div>
            <div className="text-xs text-slate-500 ml-2 truncate">{msg.content}</div>
            <div className="text-[10px] text-slate-400 ml-2">{new Date(msg.timestamp).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentMessagesSection;
