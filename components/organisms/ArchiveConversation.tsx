import CategoryBadge from "@/components/atoms/CategoryBadge";
import TemplateCategory from "@/components/atoms/TemplateCategory";
import { Archive, Brain, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
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

interface ArchiveConversationProps {
  archivedConversations: Conversation[];
  handleUnarchive: (conversationId: string) => void;
  aiFeedback: { [id: string]: "like" | "dislike" | undefined };
}

interface ArchivedConversationItemProps {
  conversation: Conversation;
  aiFeedback: { [id: string]: "like" | "dislike" | undefined };
  onUnarchive: (conversationId: string) => void;
}

const ArchivedConversationItem: React.FC<ArchivedConversationItemProps> = ({ conversation, aiFeedback, onUnarchive }) => {
  const aiMsgs = conversation.messages.filter((m) => m.sender === "ai");
  const likeCount = aiMsgs.filter((m) => aiFeedback[m.id] === "like").length;
  const dislikeCount = aiMsgs.filter((m) => aiFeedback[m.id] === "dislike").length;
  const formattedDate = conversation.updatedAt instanceof Date ? conversation.updatedAt.toLocaleDateString("en-US") : "";

  return (
    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-slate-800 truncate text-sm flex items-center gap-2">
          {conversation.title}
          <CategoryBadge category={conversation.category} size="sm" />
          <TemplateCategory template={conversation.template || "global"} className="text-xs">
            {conversation.template || "global"}
          </TemplateCategory>
        </h4>
        <button onClick={() => onUnarchive(conversation.id)} className="p-1 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-colors" aria-label="Unarchive conversation">
          <Archive className="w-3 h-3 text-emerald-600" />
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
        <span className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          {conversation.messages.length} messages
        </span>
        <span className="flex items-center gap-1">
          <Brain className="w-3 h-3" />
          {aiMsgs.length} AI responses
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{formattedDate}</span>
        <span className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3 text-emerald-500" />
          <span className="text-emerald-700 font-semibold">{likeCount}</span>
          <ThumbsDown className="w-3 h-3 text-red-500 ml-1" />
          <span className="text-red-700 font-semibold">{dislikeCount}</span>
        </span>
      </div>
    </div>
  );
};

const ArchiveConversation: React.FC<ArchiveConversationProps> = ({ archivedConversations, handleUnarchive, aiFeedback }) => {
  const hasArchivedConversations = archivedConversations.length > 0;

  if (!hasArchivedConversations) {
    return (
      <div className="p-4 text-center">
        <Archive className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-500">No archived conversations</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
        <Archive className="w-4 h-4" />
        Archived Conversations ({archivedConversations.length})
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {archivedConversations.map((conversation) => (
          <ArchivedConversationItem key={conversation.id} conversation={conversation} aiFeedback={aiFeedback} onUnarchive={handleUnarchive} />
        ))}
      </div>
    </div>
  );
};

export default ArchiveConversation;
