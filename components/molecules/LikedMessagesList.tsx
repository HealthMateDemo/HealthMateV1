import React from "react";
import { ThumbsUp } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: string;
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

interface LikedMessagesListProps {
  conversations: Conversation[];
  aiFeedback: { [id: string]: "like" | "dislike" | undefined };
  onSelectConversation?: (conversationId: string) => void;
}

const LikedMessagesList: React.FC<LikedMessagesListProps> = ({ conversations, aiFeedback, onSelectConversation }) => {
  // Find liked AI messages and their parent conversation
  const likedMessages = conversations
    .flatMap((conv) => conv.messages.filter((m) => m.sender === "ai" && aiFeedback[m.id] === "like").map((m) => ({ ...m, conversationId: conv.id, conversationTitle: conv.title })))
    .slice(0, 2);
  if (likedMessages.length === 0) return null;
  return (
    <div className="mt-4">
      <span className="block text-xs text-slate-500 font-semibold mb-2">Liked Messages</span>
      <ul className="space-y-1">
        {likedMessages.map((msg) => (
          <li key={msg.id}>
            <button
              className="w-full text-left flex items-center gap-2 px-2 py-1 rounded hover:bg-emerald-50 transition text-emerald-700 text-xs"
              onClick={() => onSelectConversation && onSelectConversation(msg.conversationId)}
              title={msg.conversationTitle}
            >
              <ThumbsUp className="w-4 h-4 text-emerald-500" />
              <span className="truncate max-w-[120px]">{msg.content.length > 40 ? msg.content.slice(0, 40) + "..." : msg.content}</span>
              <span className="ml-auto text-slate-400">{msg.conversationTitle}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LikedMessagesList;
