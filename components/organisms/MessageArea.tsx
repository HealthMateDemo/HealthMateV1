import React from "react";
import { Brain, User, ThumbsUp, ThumbsDown } from "lucide-react";
import { format } from "date-fns";
import TypingIndicator from "@/components/atoms/TypingIndicator";

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

interface MessageAreaProps {
  currentConversation: Conversation | null;
  aiFeedback: { [id: string]: "like" | "dislike" | undefined };
  handleFeedback: (msgId: string, type: "like" | "dislike") => void;
  isTyping: boolean;
}

const MessageArea: React.FC<MessageAreaProps> = ({ currentConversation, aiFeedback, handleFeedback, isTyping }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-4">
        {currentConversation?.messages.map((message, idx) => (
          <div
            key={typeof message.id === "string" && message.id.trim().length > 0 ? message.id : `msg-fallback-${idx}`}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} items-center`}
          >
            {message.sender === "ai" ? (
              <>
                <span className="mr-2 flex items-center justify-center self-center">
                  <Brain className="w-5 h-5 text-emerald-400" />
                </span>
                <div className="flex flex-col">
                  <div className={`max-w-[70vw] rounded-2xl p-4 bg-slate-100 text-slate-800`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-2 text-slate-500">
                      {format(message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp), "yyyy-MM-dd HH:mm:ss")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2" style={{ marginLeft: 0 }}>
                    <button
                      className={`p-1 rounded-full ${aiFeedback[message.id] === "like" ? "bg-emerald-100 text-emerald-600" : "text-slate-400 hover:text-emerald-500"}`}
                      onClick={() => handleFeedback(message.id, "like")}
                      aria-label="Like"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-1 rounded-full ${aiFeedback[message.id] === "dislike" ? "bg-red-100 text-red-600" : "text-slate-400 hover:text-red-500"}`}
                      onClick={() => handleFeedback(message.id, "dislike")}
                      aria-label="Dislike"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={`max-w-[70%] rounded-2xl p-4 bg-emerald-500 text-white`}>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-2 text-emerald-100">
                    {format(message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp), "yyyy-MM-dd HH:mm:ss")}
                  </p>
                </div>
                <span className="ml-2 flex items-center justify-center self-center">
                  <User className="w-5 h-5 text-white bg-emerald-500 rounded-full p-0.5" />
                </span>
              </>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-800 rounded-2xl p-4">
              <div className="flex items-center space-x-2">
                <TypingIndicator dotColorClass="bg-slate-400" />
                <span className="text-sm text-slate-500">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageArea;
