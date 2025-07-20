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
}

interface RecentMessagesSectionProps {
  conversations: Conversation[];
}

const RecentMessagesSection: React.FC<RecentMessagesSectionProps> = ({ conversations }) => {
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
  // Sort by timestamp descending and take the latest 3
  const latestUserMessages = allUserMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3);

  return (
    <div className="mt-4">
      <h3 className="font-medium text-slate-700 text-sm mb-2 text-center">Recent Messages</h3>
      <ul className="space-y-2 p-2 mx-2">
        {latestUserMessages.length === 0 && <li className="text-xs text-slate-400 italic">No user messages yet</li>}
        {latestUserMessages.map((msg) => (
          <li key={msg.id} className="border-b border-slate-100 last:border-b-0 text-xs space-y-0.5 bg-green-100 rounded-lg">
            <div className="font-semibold ml-2 text-xs text-slate-800 truncate pt-2">{msg.conversationTitle}</div>
            <div className="text-xs text-slate-500 ml-2  truncate">{msg.content}</div>
            <div className="text-[10px] text-slate-400 ml-2 ">{new Date(msg.timestamp).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentMessagesSection;
