import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, MoreVertical, Brain, Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isSaved?: boolean;
}

interface MainChatAreaProps {
  currentConversation: Conversation | null;
  inputMessage: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  isTyping: boolean;
  onSave: () => void;
}

const MainChatArea: React.FC<MainChatAreaProps> = ({
  currentConversation,
  inputMessage,
  onInputChange,
  onInputKeyPress,
  onSend,
  isTyping,
  onSave,
}) => (
  <div className="flex-1 flex flex-col">
    {/* Chat Header */}
    <div className="p-4 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">
              {currentConversation?.title || "New Conversation"}
            </h2>
            <p className="text-sm text-slate-500">
              AI Health Assistant • Online
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            disabled={currentConversation?.isSaved}
            className="text-slate-500 hover:text-slate-700"
          >
            <Save className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-700"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
    {/* Messages Area */}
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {currentConversation?.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl p-4 ${
                message.sender === "user"
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-2 ${
                  message.sender === "user"
                    ? "text-emerald-100"
                    : "text-slate-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-800 rounded-2xl p-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-slate-500">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
    {/* Input Area */}
    <div className="p-4 border-t border-slate-200 bg-white">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Input
            value={inputMessage}
            onChange={onInputChange}
            onKeyPress={onInputKeyPress}
            placeholder="Type your health question..."
            className="min-h-[44px] resize-none"
          />
        </div>
        <Button
          onClick={onSend}
          disabled={!inputMessage.trim()}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
);

export default MainChatArea;
