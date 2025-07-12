import { Brain } from "lucide-react";
import GradientIcon from "@/components/atoms/GradientIcon";

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
      <div className="flex-shrink-0 mt-1">
        <GradientIcon icon={Brain} size="md" />
      </div>
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-4 max-w-[80%]">
        <p className="text-sm whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
