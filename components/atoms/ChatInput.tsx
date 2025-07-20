import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "./LoadingSpinner";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ inputMessage, setInputMessage, handleSendMessage, isLoading }) => {
  return (
    <div className="p-4 border-t border-slate-200 bg-white">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your health question..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-[44px] resize-none"
            disabled={isLoading}
          />
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
        >
          {isLoading ? <LoadingSpinner /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
