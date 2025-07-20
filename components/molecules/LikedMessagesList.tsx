import useShowMore from "@/hooks/useShowMore";
import { ThumbsUp } from "lucide-react";
import React from "react";

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
  const likedMessages = conversations.flatMap((conv) =>
    conv.messages.filter((m) => m.sender === "ai" && aiFeedback[m.id] === "like").map((m) => ({ ...m, conversationId: conv.id, conversationTitle: conv.title })),
  );
  const { displayedItems: displayedMessages, showAll, showMore, showLess, total: totalLiked, hasMore } = useShowMore(likedMessages, 3);
  return (
    <div className="mt-4">
      <span className="text-xs text-slate-500 font-semibold mb-2 flex items-center gap-2">
        Liked Messages
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold min-w-[18px] h-[18px]">
          {totalLiked}
        </span>
      </span>
      {totalLiked === 0 ? (
        <div className="text-xs text-slate-400 mb-2">No liked messages yet.</div>
      ) : (
        <ul className="space-y-1">
          {displayedMessages.map((msg) => (
            <li key={msg.id}>
              <button
                className="w-full text-left flex items-center gap-2 px-2 py-1 rounded hover:bg-emerald-50 transition text-emerald-700 text-xs"
                onClick={() => onSelectConversation && onSelectConversation(msg.conversationId)}
                title={msg.conversationTitle}
              >
                <ThumbsUp className="w-4 h-4 text-emerald-500" />
                <span className="truncate max-w-[140px]">{msg.content.length > 40 ? msg.content.slice(0, 40) + "..." : msg.content}</span>
                <span className="ml-auto text-slate-400">{msg.conversationTitle}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {hasMore && totalLiked > 0 && !showAll && (
        <button className="mt-2 text-xs text-emerald-600 hover:underline focus:outline-none" onClick={showMore}>
          Show more
        </button>
      )}
      {hasMore && totalLiked > 0 && showAll && (
        <button className="mt-2 text-xs text-emerald-600 hover:underline focus:outline-none" onClick={showLess}>
          Show less
        </button>
      )}
    </div>
  );
};

export default LikedMessagesList;
