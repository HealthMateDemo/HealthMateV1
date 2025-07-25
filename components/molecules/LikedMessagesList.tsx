import DislikeIcon from "@/components/atoms/DislikeIcon";
import NumberBadge from "@/components/atoms/NumberBadge";
import useShowMore from "@/hooks/useShowMore";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useState } from "react";

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
  const [showDisliked, setShowDisliked] = useState(false);

  // Find liked or disliked AI messages and their parent conversation
  const getFilteredMessages = () => {
    const feedbackType = showDisliked ? "dislike" : "like";
    return conversations.flatMap((conv) =>
      conv.messages
        .filter((m) => m.sender === "ai" && aiFeedback[m.id] === feedbackType)
        .map((m) => ({
          ...m,
          conversationId: conv.id,
          conversationTitle: conv.title,
        })),
    );
  };

  const filteredMessages = getFilteredMessages();
  const { displayedItems: displayedMessages, showAll, showMore, showLess, total: totalMessages, hasMore } = useShowMore(filteredMessages, 3);

  const handleToggle = () => {
    setShowDisliked(!showDisliked);
  };

  const getTooltipText = () => {
    return showDisliked ? "Switch to liked messages" : "Switch to disliked messages";
  };

  const getIcon = () => {
    return showDisliked ? <ThumbsDown className="w-4 h-4 text-red-500" /> : <ThumbsUp className="w-4 h-4 text-emerald-500" />;
  };

  const getSectionTitle = () => {
    return showDisliked ? "Disliked Messages" : "Liked Messages";
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-slate-500 font-semibold flex items-center gap-2">
          {getSectionTitle()}
          <NumberBadge count={totalMessages} variant="emerald" />
        </span>
        <DislikeIcon onClick={handleToggle} size={14} tooltipText={getTooltipText()} />
      </div>

      {totalMessages === 0 ? (
        <div className="text-xs text-slate-400 mb-2">No {showDisliked ? "disliked" : "liked"} messages yet.</div>
      ) : (
        <ul className="space-y-1">
          {displayedMessages.map((msg) => (
            <li key={msg.id}>
              <button
                className="w-full text-left flex items-center gap-2 px-2 py-1 rounded hover:bg-emerald-50 transition text-emerald-700 text-xs"
                onClick={() => onSelectConversation && onSelectConversation(msg.conversationId)}
                title={msg.conversationTitle}
              >
                {getIcon()}
                <span className="truncate max-w-[140px]">{msg.content.length > 40 ? msg.content.slice(0, 40) + "..." : msg.content}</span>
                <span className="ml-auto text-slate-400">{msg.conversationTitle}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {hasMore && totalMessages > 0 && !showAll && (
        <button className="mt-2 text-xs text-emerald-600 hover:underline focus:outline-none" onClick={showMore}>
          Show more
        </button>
      )}
      {hasMore && totalMessages > 0 && showAll && (
        <button className="mt-2 text-xs text-emerald-600 hover:underline focus:outline-none" onClick={showLess}>
          Show less
        </button>
      )}
    </div>
  );
};

export default LikedMessagesList;
