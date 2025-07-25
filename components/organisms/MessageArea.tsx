import CopyButton from "@/components/atoms/CopyButton";
import Tooltip from "@/components/atoms/Tooltip";
import TypingIndicator from "@/components/atoms/TypingIndicator";
import { openImageInNewTab } from "@/util/image-viewer";
import { renderMarkdown } from "@/util/markdown";
import { format } from "date-fns";
import { Brain, ThumbsDown, ThumbsUp, User } from "lucide-react";
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

interface MessageAreaProps {
  currentConversation: Conversation | null;
  aiFeedback: { [id: string]: "like" | "dislike" | undefined };
  handleFeedback: (msgId: string, type: "like" | "dislike") => void;
  isTyping: boolean;
}

const MessageArea: React.FC<MessageAreaProps> = ({ currentConversation, aiFeedback, handleFeedback, isTyping }) => {
  const getMessageKey = (message: Message, idx: number) => {
    const isValidId = typeof message.id === "string" && message.id.trim().length > 0;
    return isValidId ? message.id : `msg-fallback-${idx}`;
  };

  const getMessageContainerClass = (sender: "user" | "ai") => {
    const baseClass = "flex items-center";
    const alignmentClass = sender === "user" ? "justify-end" : "justify-start";
    return `${baseClass} ${alignmentClass}`;
  };

  const getFormattedTimestamp = (timestamp: Date) => {
    const dateToFormat = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return format(dateToFormat, "yyyy-MM-dd HH:mm:ss");
  };

  const getLikeButtonClass = (messageId: string) => {
    const isLiked = aiFeedback[messageId] === "like";
    const baseClass = "p-1 rounded-full";
    return isLiked ? `${baseClass} bg-emerald-100 text-emerald-600` : `${baseClass} text-slate-400 hover:text-emerald-500`;
  };

  const getDislikeButtonClass = (messageId: string) => {
    const isDisliked = aiFeedback[messageId] === "dislike";
    const baseClass = "p-1 rounded-full";
    return isDisliked ? `${baseClass} bg-red-100 text-red-600` : `${baseClass} text-slate-400 hover:text-red-500`;
  };

  const renderAIMessage = (message: Message) => {
    const markdownElement = renderMarkdown(message.content);

    return (
      <>
        <span className="mr-2 flex items-center justify-center self-center">
          <Brain className="w-5 h-5 text-emerald-400" />
        </span>
        <div className="flex flex-col">
          <div className="max-w-[70vw] rounded-2xl p-4 bg-slate-100">
            <div className="markdown text-sm text-slate-800 max-w-full overflow-hidden break-words">{markdownElement}</div>
            <p className="text-xs mt-2 text-slate-500">{getFormattedTimestamp(message.timestamp)}</p>
          </div>
          <div className="flex items-center justify-between mt-2 px-4" style={{ marginLeft: 0 }}>
            <div className="flex items-center gap-2">
              <Tooltip title="Like this response">
                <button className={getLikeButtonClass(message.id)} onClick={() => handleFeedback(message.id, "like")} aria-label="Like">
                  <ThumbsUp className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip title="Dislike this response">
                <button className={getDislikeButtonClass(message.id)} onClick={() => handleFeedback(message.id, "dislike")} aria-label="Dislike">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
            <Tooltip title="Copy message">
              <CopyButton content={message.content} />
            </Tooltip>
          </div>
        </div>
      </>
    );
  };

  const renderUserMessage = (message: Message) => {
    return (
      <>
        <div className="max-w-[70%] rounded-2xl p-4 bg-emerald-500 text-white">
          {message.type === "image" ? (
            <div>
              {/* Parse the content to extract base64 data and filename */}
              {(() => {
                const [imageData, filename] = message.content.split("|");
                return (
                  <>
                    <img
                      src={imageData}
                      alt="User uploaded"
                      className="w-full max-h-64 object-cover rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity duration-200"
                      onClick={() => {
                        // Open image in new tab
                        openImageInNewTab(imageData, filename || "Uploaded Image");
                      }}
                      title="Click to view full size"
                    />
                    <p className="text-sm">Image uploaded</p>
                    <p className="text-xs text-emerald-100 mt-1 font-mono">{filename || "Unknown file"}</p>
                  </>
                );
              })()}
            </div>
          ) : (
            <p className="text-sm">{message.content}</p>
          )}
          <p className="text-xs mt-2 text-emerald-100">{getFormattedTimestamp(message.timestamp)}</p>
        </div>
        <span className="ml-2 flex items-center justify-center self-center">
          <User className="w-5 h-5 text-white bg-emerald-500 rounded-full p-0.5" />
        </span>
      </>
    );
  };

  const renderMessage = (message: Message, idx: number) => {
    return (
      <div key={getMessageKey(message, idx)} className={getMessageContainerClass(message.sender)}>
        {message.sender === "ai" ? renderAIMessage(message) : renderUserMessage(message)}
      </div>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <div className="flex justify-start">
        <div className="bg-slate-100 text-slate-800 rounded-2xl p-4">
          <div className="flex items-center space-x-2">
            <TypingIndicator dotColorClass="bg-slate-400" />
            <span className="text-sm text-slate-500">AI is typing...</span>
          </div>
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    if (!currentConversation?.messages) return null;

    return currentConversation.messages.map((message, idx) => renderMessage(message, idx));
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-4">
        {renderMessages()}
        {renderTypingIndicator()}
      </div>
    </div>
  );
};

export default MessageArea;
