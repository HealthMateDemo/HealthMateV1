import React from "react";
import { Brain } from "lucide-react";

interface ChatMessageProps {
  content: string;
  sender: "user" | "ai";
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, sender }) => {
  if (sender === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-slate-100 rounded-2xl p-4 max-w-[80%]">
          <p className="text-slate-700 text-sm">{content}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        <Brain className="w-4 h-4 text-white" />
      </div>
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-4 max-w-[80%]">
        <p className="text-sm whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
